import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

/**
 * "Budget Buddy" — a small floating AI-chatbot widget for the expense
 * tracker. Keeps a message history, supports sending via button click or
 * the Enter key, and shows an animated loading indicator while a "reply"
 * is being generated.
 *
 * NOTE: replies are currently generated locally with simple keyword
 * matching (see generateMockReply). To make this a live AI assistant,
 * replace the setTimeout block in sendMessage() with an HttpClient call
 * to your AI backend of choice.
 */
@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-wrapper">
      @if (isOpen()) {
        <div class="chat-window">
          <div class="chat-header">
            <span>💬 Budget Buddy</span>
            <button class="close-btn" (click)="toggleOpen()" aria-label="Close chat">✕</button>
          </div>

          <div class="chat-messages" #messagesContainer>
            @for (msg of messages(); track $index) {
              <div class="chat-bubble" [class.user]="msg.sender === 'user'" [class.bot]="msg.sender === 'bot'">
                {{ msg.text }}
              </div>
            }
            @if (isLoading()) {
              <div class="chat-bubble bot loading">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            }
          </div>

          <div class="chat-input-row">
            <input
              type="text"
              placeholder="Ask about your spending..."
              [(ngModel)]="draftMessage"
              (keydown.enter)="sendMessage()"
            />
            <button (click)="sendMessage()" [disabled]="!draftMessage.trim() || isLoading()">
              Send
            </button>
          </div>
        </div>
      } @else {
        <button class="chat-toggle" (click)="toggleOpen()" aria-label="Open chat">💬</button>
      }
    </div>
  `,
  styles: [`
    .chatbot-wrapper { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 50; }
    .chat-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: #4f46e5;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .chat-window {
      width: 320px;
      height: 420px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chat-header {
      background: #4f46e5;
      color: white;
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
    .close-btn { background: none; border: none; color: white; cursor: pointer; font-size: 1rem; }
    .chat-messages {
      flex: 1;
      padding: 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .chat-bubble {
      max-width: 80%;
      padding: 0.5rem 0.75rem;
      border-radius: 10px;
      font-size: 0.85rem;
      line-height: 1.3;
    }
    .chat-bubble.user { align-self: flex-end; background: #4f46e5; color: white; }
    .chat-bubble.bot { align-self: flex-start; background: #f3f4f6; color: #111827; }
    .chat-bubble.loading { display: flex; gap: 4px; align-items: center; }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #9ca3af;
      animation: blink 1.2s infinite ease-in-out;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink {
      0%, 80%, 100% { opacity: 0.3; }
      40% { opacity: 1; }
    }
    .chat-input-row {
      display: flex;
      border-top: 1px solid #e5e7eb;
      padding: 0.5rem;
      gap: 0.5rem;
    }
    .chat-input-row input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.4rem 0.6rem;
      font-size: 0.85rem;
      font-family: inherit;
    }
    .chat-input-row button {
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 0.9rem;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .chat-input-row button:disabled { background: #a5a6f6; cursor: not-allowed; }
  `],
})
export class ChatbotComponent {
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  isLoading = signal(false);
  draftMessage = '';

  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: "Hi! I'm Budget Buddy 🤖. Ask me anything about tracking your expenses!" },
  ]);

  toggleOpen(): void {
    this.isOpen.update((open) => !open);
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    if (!text || this.isLoading()) return;

    this.messages.update((msgs) => [...msgs, { sender: 'user', text }]);
    this.draftMessage = '';
    this.isLoading.set(true);
    this.scrollToBottom();

    // Simulated AI response with a short delay so the loading indicator is
    // visible. Swap this block for a real HTTP call to wire up a live model.
    setTimeout(() => {
      const reply = this.generateMockReply(text);
      this.messages.update((msgs) => [...msgs, { sender: 'bot', text: reply }]);
      this.isLoading.set(false);
      this.scrollToBottom();
    }, 700);
  }

  private generateMockReply(userText: string): string {
    const lower = userText.toLowerCase();
    if (lower.includes('budget')) {
      return 'A good rule of thumb is the 50/30/20 rule: 50% needs, 30% wants, 20% savings.';
    }
    if (lower.includes('food') || lower.includes('grocery')) {
      return 'Try meal-prepping to cut down on food spending — it can save 20-30% a month!';
    }
    if (lower.includes('save') || lower.includes('saving')) {
      return 'Set up a small automatic transfer to savings each payday — consistency beats big one-off deposits.';
    }
    return "I'm just a demo bot for now, but I'd suggest reviewing your 'Entertainment' and 'Shopping' categories first — they usually have the easiest wins!";
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }
}
