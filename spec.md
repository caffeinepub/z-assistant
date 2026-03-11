# Z Assistant

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- AI chat assistant interface with a default name "Z Assistant"
- Ability to rename the assistant (stored persistently in backend)
- Chat UI where users can send messages and receive AI-like responses
- Settings panel to change the assistant's name

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend: Store assistant name (default "Z Assistant") with get/set methods; store chat messages
- Frontend: Chat interface with message input, message history, assistant name display, and a settings option to rename the assistant
