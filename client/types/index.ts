export interface Me {
    id: string,
    email: string;
    avatar: string;
    isMale: boolean;
    bio: {
        fullName: string;
        title: string;
        about: String;
        links?: [string];
    };
    role: string;
    createdAt?: string;
    updatedAt?: string;
};

export interface Conversations {
    groupConversations: GroupConversation[],
    privateConversations: PrivateConversation[]
}

export interface GroupConversation {
    id: string; // conversationId
    recipient: Recipient[];
    lastMessage?: LastMessage
}

export interface PrivateConversation {
    id: string; // conversationId
    recipient: Recipient;
    lastMessage?: LastMessage  
}

export interface Recipient {
    id: string; // userId
    avatar?: string;
    name: string;
    title: string;
    about: string;
    links?: string[];
    color: string;
    gender: string;
}

interface Bio {
	links: any[];
	_id: string;
	fullName: string;
	title: string;
	about: string;
}

export interface ParticipantProfile {
	_id: string;
	email: string;
    avatar?: string;
	isMale: boolean;
	bio: Bio;
	role: string;
}

export interface LastMessage {
    text: string;
    createdAt: string,
    senderId: string;
    seen: boolean;  
}

export interface ConversationApiResponse {
	_id: string;
	private: boolean;
    lastMessage?: LastMessage,
	participantProfiles: ParticipantProfile[];
}

export interface  MessagesApiResponse {
    conversationId: string,
    messageBatches: MessageBatches[];
}

export interface MessageBatches {
    _id: string,
    allMessages: AllMessages[]
}

export interface AllMessages {
    message: string,
    senderId: string,
    timestamp: string
}

export interface MessageObject {
    conversationId: string,
    senderId: string,
    receiverId: string,
    role: Role,
    message: string,
    timestamp: Date,
    directMessage: boolean
}

export enum Role {
   Admin = 'admin',
   Moderator = 'moderator',
   Group = 'group',
   Client = 'client'
}

export interface ContactProfile extends Recipient {}


