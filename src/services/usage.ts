import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ToolName = 'youtube' | 'research' | 'notes';

export async function trackUsage(tool: ToolName, userEmail: string | null | undefined) {
    if (!userEmail) return;

    try {
        await addDoc(collection(db, 'usage_stats'), {
            tool,
            userEmail,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error(`Failed to track usage for ${tool}:`, error);
    }
}

export async function saveAsNote(userEmail: string, title: string, content: string) {
    try {
        await addDoc(collection(db, 'notes'), {
            title,
            content,
            user_email: userEmail,
            created_at: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to save as note:', error);
        return { success: false, error };
    }
}
