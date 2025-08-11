// src/hooks/index.ts
// Centralized exports for all custom hooks

// Auth hooks
export { useAuth, useRequireAuth, useRequireStaff, useAuthActions } from './useAuth'

// Data hooks
export { useBooks, useBooksAdmin, useBook, useBookMutations } from './useBooks'
export { useEvents, useEventsAdmin, useEvent, useEventMutations } from './useEvents'
export { useMenu, useMenuAdmin, useMenuItem, useMenuMutations } from './useMenu'
export { useBeans, useBeansAdmin, useBean, useBeanMutations } from './useBeans'

// Upload hooks
export { useUpload, useMultiUpload } from './useUpload'