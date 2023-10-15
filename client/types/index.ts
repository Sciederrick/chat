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

export interface PrivateConversation {
    id: string; // conversationId
    recipient: {
        id: string; // userId
        avatar?: string;
        name: string;
        title: string;
        about: string;
        links?: string[];
        color: string;
        gender: string;
    };
    lastMessage?: {
        text: string;
        createdAt: string;
        senderId: string;
        seen: boolean;          
    }  
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

export interface NestedRecipient {
    id: string;
    avatar: string;
    name: string;
    title: string;
    about: string;
    links: string[];
    color: string; 
    gender: string;
}
