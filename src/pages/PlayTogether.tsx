import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { galleryImages } from '../data/gallery';
import { createPuzzleRoom, getPlayerName, playerList, roomShareUrl, setPlayerName } from '../engine/roomClient';
import { shareOrCopy } from '../engine/dailyChallenge';
import { usePuzzleRoom } from '../hooks/usePuzzleRoom';
import { useSeo } from '../hooks/useSeo';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { GalleryArt } from '../components/LivingPicture';

const ROOM_PICTURES = ['curious-puppy', 'tropical-beach', 'starry-night', 'sitting-cat', 'sunny-pals', 'red-fox'];
const PIECE_CHOICES = [24, 48, 100];

export function PlayTogether() {
  const { code } = useParams<{ code?: string }>();
  return code ? <RoomLobby code={code} /> : <CreateRoom />;
}

function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => getPlayerName() || 'Friend');
  const [joinCode, setJoinCode] = useState('');
  const [imageId, setImageId] = useState(ROOM_PICTURES[0]);
  const [pieces, setPieces] = useState(24);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: 'Play together — Room races | Puzzle Harbour',
    description: 'Create a room, share a code, and race the same jigsaw. No login.',
    path: '/play',
  });

  const pictures = ROOM_PICTURES.map((id) => galleryImages.find((image) => image.id === id)).filter(Boolean);

  const create = async () => {
    const image = galleryImages.find((item) => item.id === imageId);
    if (!image) return;
    setBusy(true);
    setError(null);
    setPlayerName(name);
    try {
      const room = await createPuzzleRoom({
        imageId: image.id,
        pieces,
        title: image.title,
        name: name.trim() || 'Friend',
      });
      navigate(`/play/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create a room.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="home-page">
      <SiteHeader />
      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Play together</span>
      </nav>
      <header className="page-hero">
        <h1>Play together</h1>
        <p className="page-hero-lead">No account. Make a room, send the code, and race the same picture.</p>
      </header>

      <div className="room-setup">
        <label className="room-field">
          Your name
          <input value={name} maxLength={24} onChange={(event) => setName(event.target.value)} />
        </label>

        <section>
          <h2>Create a room</h2>
          <div className="room-picture-grid">
            {pictures.map((image) =>
              image ? (
                <button
                  key={image.id}
                  type="button"
                  className={`room-picture${image.id === imageId ? ' selected' : ''}`}
                  onClick={() => setImageId(image.id)}
                >
                  <GalleryArt src={image.src} title={image.title} animated={image.animated} />
                  <span>{image.title}</span>
                </button>
              ) : null,
            )}
          </div>
          <div className="room-piece-row">
            {PIECE_CHOICES.map((count) => (
              <button
                key={count}
                type="button"
                className={`difficulty-chip${pieces === count ? ' active' : ''}`}
                onClick={() => setPieces(count)}
              >
                {count} pieces
              </button>
            ))}
          </div>
          {error && <p className="room-error">{error}</p>}
          <button type="button" className="btn btn-primary" onClick={create} disabled={busy}>
            {busy ? 'Opening room…' : 'Create room'}
          </button>
        </section>

        <section>
          <h2>Or join a room</h2>
          <form
            className="room-join"
            onSubmit={(event) => {
              event.preventDefault();
              const next = joinCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
              if (next.length >= 4) {
                setPlayerName(name);
                navigate(`/play/${next}`);
              }
            }}
          >
            <input
              value={joinCode}
              maxLength={6}
              placeholder="ABCD"
              onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              aria-label="Room code"
            />
            <button type="submit" className="btn btn-secondary">
              Join
            </button>
          </form>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}

function RoomLobby({ code }: { code: string }) {
  const navigate = useNavigate();
  const [name] = useState(() => getPlayerName() || 'Friend');
  const { room, error, connected, send, playerId } = usePuzzleRoom(code, name);
  const [shareState, setShareState] = useState('Copy invite');

  useSeo({
    title: `Room ${code.toUpperCase()} — Play together | Puzzle Harbour`,
    description: 'Join this jigsaw room and race friends. No login.',
    path: `/play/${code.toUpperCase()}`,
    noindex: true,
  });

  useEffect(() => {
    if (room?.status === 'playing' || room?.status === 'finished') {
      navigate(`/puzzle/${room.imageId}?pieces=${room.pieces}&rotate=0&room=${room.code}`, { replace: true });
    }
  }, [room, navigate]);

  const players = room ? playerList(room) : [];
  const me = room?.players[playerId];
  const image = galleryImages.find((item) => item.id === room?.imageId);

  return (
    <div className="home-page">
      <SiteHeader />
      <nav className="breadcrumb page-breadcrumb-row" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/play">Play together</Link>
        <span aria-hidden="true"> / </span>
        <span>{code.toUpperCase()}</span>
      </nav>

      <header className="page-hero">
        <h1>Room {code.toUpperCase()}</h1>
        <p className="page-hero-lead">
          {connected ? 'Waiting in the lobby. Share the code, then start the race.' : 'Connecting…'}
        </p>
      </header>

      {error && <p className="room-error">{error}</p>}

      {room && (
        <div className="room-lobby">
          <div className="room-lobby-invite">
            <strong>{room.code}</strong>
            <p>{room.title} · {room.pieces} pieces</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                const result = await shareOrCopy(`Race me at Jigsaw! Room ${room.code}\n${roomShareUrl(room.code)}`);
                setShareState(result === 'failed' ? 'Copy invite' : result === 'shared' ? 'Sent!' : 'Copied!');
                window.setTimeout(() => setShareState('Copy invite'), 2000);
              }}
            >
              {shareState}
            </button>
          </div>

          {image && (
            <div className="room-lobby-art">
              <GalleryArt src={image.src} title={image.title} animated={image.animated} />
            </div>
          )}

          <ul className="room-roster">
            {players.map((player) => (
              <li key={player.id} className={player.connected ? '' : 'away'}>
                <span>
                  {player.name}
                  {player.isHost ? ' · host' : ''}
                  {player.id === playerId ? ' · you' : ''}
                </span>
                <em>{player.connected ? 'Here' : 'Away'}</em>
              </li>
            ))}
          </ul>

          {me?.isHost ? (
            <button type="button" className="btn btn-primary" onClick={() => send({ type: 'start' })}>
              Start the race
            </button>
          ) : (
            <p className="room-wait">Waiting for the host to start.</p>
          )}
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
