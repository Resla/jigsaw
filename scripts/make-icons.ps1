Add-Type -AssemblyName System.Drawing

function New-JigsawIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [double]$SafeMarginRatio = 0.10
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    function Add-RoundedRect {
        param($path, [double]$x, [double]$y, [double]$w, [double]$h, [double]$r)
        $path.AddArc($x, $y, $r * 2, $r * 2, 180, 90)
        $path.AddArc($x + $w - $r * 2, $y, $r * 2, $r * 2, 270, 90)
        $path.AddArc($x + $w - $r * 2, $y + $h - $r * 2, $r * 2, $r * 2, 0, 90)
        $path.AddArc($x, $y + $h - $r * 2, $r * 2, $r * 2, 90, 90)
        $path.CloseFigure()
    }

    # Background: rounded square with a warm-to-cool brand gradient.
    $bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $bgRadius = $Size * 0.22
    Add-RoundedRect $bgPath 0 0 $Size $Size $bgRadius
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($Size, $Size)),
        [System.Drawing.Color]::FromArgb(255, 0x4d, 0x96, 0xff),
        [System.Drawing.Color]::FromArgb(255, 0xff, 0x6b, 0x6b)
    )
    $g.FillPath($bgBrush, $bgPath)

    # Four puzzle-piece quadrants in white, inset from the safe zone, with tab bumps bridging the gaps.
    $margin = $Size * $SafeMarginRatio
    $inner = $Size - $margin * 2
    $gap = $inner * 0.07
    $pieceSize = ($inner - $gap) / 2
    $pieceRadius = $pieceSize * 0.28
    $white = [System.Drawing.Color]::FromArgb(245, 255, 250, 240)
    $whiteBrush = New-Object System.Drawing.SolidBrush($white)

    $positions = @(
        @{ x = $margin; y = $margin },
        @{ x = $margin + $pieceSize + $gap; y = $margin },
        @{ x = $margin; y = $margin + $pieceSize + $gap },
        @{ x = $margin + $pieceSize + $gap; y = $margin + $pieceSize + $gap }
    )
    foreach ($pos in $positions) {
        $p = New-Object System.Drawing.Drawing2D.GraphicsPath
        Add-RoundedRect $p $pos.x $pos.y $pieceSize $pieceSize $pieceRadius
        $g.FillPath($whiteBrush, $p)
    }

    # Bump tabs bridging each adjacent pair (top mid, bottom mid, left mid, right mid).
    $tabR = $gap * 1.05
    $cx = $margin + $pieceSize + $gap / 2
    $cy = $margin + $pieceSize + $gap / 2
    $tabPositions = @(
        @{ x = $cx; y = $margin + $pieceSize * 0.5 },
        @{ x = $cx; y = $margin + $pieceSize * 1.5 + $gap },
        @{ x = $margin + $pieceSize * 0.5; y = $cy },
        @{ x = $margin + $pieceSize * 1.5 + $gap; y = $cy }
    )
    foreach ($t in $tabPositions) {
        $g.FillEllipse($whiteBrush, [float]($t.x - $tabR), [float]($t.y - $tabR), [float]($tabR * 2), [float]($tabR * 2))
    }

    $dir = Split-Path $OutPath
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

New-JigsawIcon -Size 192 -OutPath "public/icons/icon-192.png" -SafeMarginRatio 0.10
New-JigsawIcon -Size 512 -OutPath "public/icons/icon-512.png" -SafeMarginRatio 0.10
New-JigsawIcon -Size 512 -OutPath "public/icons/icon-512-maskable.png" -SafeMarginRatio 0.18
New-JigsawIcon -Size 180 -OutPath "public/icons/apple-touch-icon.png" -SafeMarginRatio 0.14

Write-Output "Icons generated."
