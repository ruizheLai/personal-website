# Phase 5P release review

The cinematic portfolio now owns the homepage at `/`. Phase 5O remains available under `/design-lab/phase5o` for comparison.

## Welcome and readiness

The original heading and supporting copy stay mounted throughout the welcome. They fade up over 500 ms and remain centred for at least 1.24 seconds after the entrance. The same elements move to their upper-left layout over 850 ms while the workspace fades in. The reveal waits for the GLB and textures to resolve and for the model to render at a usable viewport size. The canvas stays mounted through the reveal.

Direct section hashes and browser history restores go straight to the destination. The Top Bar remains operable during the welcome. The workspace accepts input when the reveal finishes, and wheel input from the welcome is discarded. Reduced motion skips the timed hold and movement once the scene is ready. A missing asset or unavailable WebGL shows the existing static fallback. If loading is still pending at nine seconds, the homepage releases scrolling and shows a static workspace image while the same scene continues loading.

## Navigation and routes

The cinematic controller distinguishes scroll, workspace-object and Top Bar navigation. The frame click reuses the joined 242-frame, 24 FPS entrance and the same camera and Introduction cues as wheel-triggered playback. The camera opens during the pull, then stays open for the fall, recovery and greeting. Monitor and phone clicks use the original 1,000 ms and 950 ms camera stages. Top Bar forward and rewind retain the Phase 5O shortcuts. All three modes share scrolling, Escape, focus and media recovery behaviour.

The homepage has one adaptive header, an indexable title and description, and an Open Graph image and canonical tied to the Vercel production domain. `/about` and `/contact` redirect to the corresponding homepage sections. `/projects` retains the existing archive, and both FixLens and Sippy case studies keep their URLs, navigation and refresh behaviour.

## Release checks

Next.js was patched from 16.4.3 to 16.4.6 after the initial registry audit. The post-upgrade audit reported zero vulnerabilities. TypeScript, the default production build, the model audit and the existing interaction checks are part of the release gate.

| Interaction | Local Chrome time from lock to release |
| --- | ---: |
| Picture-frame click → About | 10.23 s |
| Monitor click → Projects | 1.06 s |
| Phone click → Contact | 1.01 s |
| About → Projects, Top Bar | 2.96 s |
| Projects → About, Top Bar | 2.63 s |

Browser QA covered 1920 × 1080, 1440 × 900, 1024 × 768, 768 × 900, 390 × 844 and 375 × 812. It exercised all 24 forward and reverse wheel-triggered stages, later chapter poses and reading holds, real pointer activation of all three portals, both case-study refreshes, legacy routes, direct hashes, email and browser history. The opening film remained continuous across the pull and fall, and the About panel was fully open during recovery.

The slow-network exercise paused the actual GLB request beyond the minimum welcome time. The scene stayed covered until the model was released and rendered. A second paused request exercised the nine-second fallback. Blocked GLB, texture and entrance video requests, unavailable WebGL, reduced motion, resize, repeated navigation and Escape were checked separately.

## Evidence

| Capture | Scenario |
| --- | --- |
| [Centred welcome](screenshots/centred-welcome.png) | Welcome copy while the scene is covered |
| [Welcome in motion](screenshots/welcome-to-workspace.png) | Text moving and the scene fading in |
| [Final workspace](screenshots/final-workspace.png) | Upper-left text and interactive scene |
| [Welcome recording](recordings/welcome.mp4) | Centred hold through scene reveal |
| [Picture-frame click](recordings/frame-click.mp4) | Original-speed wake, pull, fall, recovery and introduction |
| [Monitor click](recordings/monitor-click.mp4) | Normal camera approach to Projects |
| [Phone click](recordings/phone-click.mp4) | Normal camera approach to Contact |
| [Top Bar fast-forward](recordings/top-forward.mp4) | About → Projects shortcut |
| [Top Bar rewind](recordings/top-rewind.mp4) | Projects → About shortcut |
