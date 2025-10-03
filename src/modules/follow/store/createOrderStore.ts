import { create } from 'zustand';

interface CreateOrderState {
  isPublic: boolean;
  declaration?: string;
  selectedTag?: FollowHallDeclaration.PostsOrderDeclaration;
  tagList: FollowHallDeclaration.PostsOrderDeclaration[];

  setPublic: (val: boolean) => void;
  setDeclaration: (val: string) => void;
  setSelectedTag: (val: FollowHallDeclaration.PostsOrderDeclaration) => void;
  setTagList: (val: FollowHallDeclaration.PostsOrderDeclaration[]) => void;
}

export const useCreateOrderStore = create<CreateOrderState>(set => ({
  isPublic: false,
  declaration: '',
  tagList: [],
  setPublic: isPublic => set({ isPublic }),
  setDeclaration: declaration => set({ declaration }),
  setSelectedTag: selectedTag => set({ selectedTag }),
  setTagList: tagList => set({ tagList }),
}));
