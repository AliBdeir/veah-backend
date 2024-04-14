import { getDatabase, ref, push, set, child, get, serverTimestamp } from 'firebase/database';
import { firebaseApp } from '../..';

interface ChatSession {
    id?: string; // Optional since it's assigned after creation
    messages: Message[];
}

interface Message {
    senderId: string;
    text: string;
    timestamp: number;
}

class FirebaseService {
    private dbRef;

    constructor() {
        this.dbRef = ref(getDatabase(firebaseApp), 'chatSessions');
    }

    // Creates a new chat session with initial data
    async createChatSession(initialData: ChatSession): Promise<string> {
        const newSessionRef = push(this.dbRef);
        await set(newSessionRef, {
            ...initialData,
            createdAt: serverTimestamp(),
        });
        return newSessionRef.key!;
    }

    // Retrieves an existing chat session by its ID
    async getChatSession(sessionId: string): Promise<ChatSession | null> {
        const sessionRef = child(this.dbRef, sessionId);
        const snapshot = await get(sessionRef);
        const data = snapshot.val();
        return data ? { id: sessionId, ...data } : null;
    }

    async appendToChatSession(sessionId: string, message: Message): Promise<void> {
        const messagesRef = ref(getDatabase(firebaseApp), `chatSessions/${sessionId}/messages`);
        const snapshot = await get(messagesRef);
        const messageCount = snapshot.exists() ? snapshot.size : 0; // Correct way to get number of children
        const newIndex = messageCount.toString(); // Convert to string as Firebase keys are strings
        await set(child(messagesRef, newIndex), message);
    }

    async markSessionAsSent(sessionId: string): Promise<void> {
        const sessionRef = ref(getDatabase(firebaseApp), `chatSessions/${sessionId}`);
        await set(child(sessionRef, 'sent'), true);
    }
}

export default FirebaseService;
