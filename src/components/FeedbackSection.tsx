import { useEffect, useState, type FormEvent } from 'react';
import { FEEDBACK_EMAIL, SITE_NAME } from '../data/siteConfig';

const SENTIMENTS = [
  { id: 'love', label: 'Loving it' },
  { id: 'ok', label: 'It’s okay' },
  { id: 'issue', label: 'Something’s off' },
] as const;

type Sentiment = (typeof SENTIMENTS)[number]['id'];

function buildBody(sentiment: Sentiment, message: string, replyTo: string): string {
  const mood = SENTIMENTS.find((item) => item.id === sentiment)?.label ?? sentiment;
  const lines = [`How it feels: ${mood}`, '', message.trim()];
  if (replyTo.trim()) lines.push('', `Reply to: ${replyTo.trim()}`);
  return lines.join('\n');
}

async function sendFeedback(sentiment: Sentiment, message: string, replyTo: string): Promise<void> {
  const body = buildBody(sentiment, message, replyTo);
  const subject = `${SITE_NAME} feedback`;

  if (FEEDBACK_EMAIL) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FEEDBACK_EMAIL)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          sentiment,
          message: body,
          email: replyTo.trim() || undefined,
        }),
      });
      if (res.ok) return;
    } catch {
      // Fall through to the visitor's mail app.
    }
  }

  const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

export function FeedbackSection() {
  const [sentiment, setSentiment] = useState<Sentiment>('love');
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if (window.location.hash === '#feedback') {
      document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      await sendFeedback(sentiment, message, replyTo);
      setStatus('sent');
      setMessage('');
      setReplyTo('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="feedback-section" id="feedback">
      <header className="feedback-header">
        <h2>Tell us how it’s going</h2>
        <p>A line or two is enough — what you liked, what felt off, or a puzzle you’d like to see next.</p>
      </header>

      {status === 'sent' ? (
        <p className="feedback-thanks" role="status">
          Thank you — that note is on its way.
        </p>
      ) : (
        <form className="feedback-form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="feedback-sentiments" role="group" aria-label="How it felt">
            {SENTIMENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`feedback-sentiment ${sentiment === item.id ? 'active' : ''}`}
                onClick={() => setSentiment(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="feedback-label" htmlFor="feedback-message">
            Your note
          </label>
          <textarea
            id="feedback-message"
            className="feedback-textarea"
            rows={4}
            required
            maxLength={2000}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="The snap feels great. I’d love more city puzzles…"
          />

          <label className="feedback-label" htmlFor="feedback-email">
            Email <span>(optional, if you want a reply)</span>
          </label>
          <input
            id="feedback-email"
            className="feedback-input"
            type="email"
            autoComplete="email"
            value={replyTo}
            onChange={(event) => setReplyTo(event.target.value)}
            placeholder="you@email.com"
          />

          {status === 'error' && (
            <p className="feedback-error" role="alert">
              That didn’t send. Try again, or email us directly.
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={status === 'sending' || !message.trim()}>
            {status === 'sending' ? 'Sending…' : 'Send feedback'}
          </button>
        </form>
      )}
    </section>
  );
}
