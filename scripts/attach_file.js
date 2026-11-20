// Attach a real image file to a webmail compose window from a browser automation tool.
// Use when the agent can run JS in the page but can't reach the file on disk.
// 1. In a shell: base64 -w0 card.jpg  (resize first so it is under ~100 KB)
// 2. Paste the base64 into B64 below and run this in the compose tab.
// 3. Then open the attachment preview and LOOK at it before pressing Send.
const B64 = '<paste base64 here>';
const NAME = 'meet_pet.jpg';
const bytes = Uint8Array.from(atob(B64), c => c.charCodeAt(0));
const file = new File([bytes], NAME, { type: 'image/jpeg' });
const inputs = [...document.querySelectorAll('input[type=file]')];
const input = inputs[inputs.length - 1]; // newest compose window
const dt = new DataTransfer(); dt.items.add(file);
input.files = dt.files;
input.dispatchEvent(new Event('change', { bubbles: true }));
`attached ${NAME} (${file.size} bytes) to input ${inputs.length}`;
