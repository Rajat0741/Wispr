# Wispr

A real-time chat application built with Next.js featuring direct messaging, group conversations, instant sync, and a clean, focused interface.

## Overview

Wispr is a minimalist messenger designed for direct conversations without social feed clutter. It combines real-time messaging via Supabase Realtime, secure authentication with Better Auth, and a modern tech stack to deliver a fast, distraction-free communication experience.

## Core Features

- Real-time messaging with instant sync via Supabase Realtime
- Direct messages (DMs) and group conversations
- User authentication with Google OAuth
- User profiles with customizable usernames and bios
- Message replies and user mentions
- Room management (create, edit, pin conversations)
- User search and member management
- Clean, modern UI with dark mode support

## Engineering Highlights

### Real-Time Architecture

- Supabase Realtime for instant message broadcasting across all connected clients
- WebSocket-based pub/sub system ensures zero-latency message delivery
- Optimistic UI updates for immediate feedback while server confirms

### Authentication & Security

- Better Auth integration with Google OAuth
- Username system for personalized user identities
- User profiles with bio customization

### Data Layer

- PostgreSQL + Drizzle ORM for structured data persistence
- Separate schemas for auth, rooms, messages, and relationships
- Support for both DMs and group chats with role-based permissions
- Message threading with reply support

### User Experience

- Responsive design with mobile-first approach
- Dark mode support via next-themes
- Clean, distraction-free interface focused on conversations
- Smooth animations and transitions

## Technical Decisions

- Supabase Realtime was chosen over custom WebSocket implementation for reliability and ease of use
- Better Auth provides a modern, flexible authentication solution with excellent Next.js integration
- Drizzle ORM offers type-safe database queries with excellent TypeScript support
- Separate room types (DM vs group) allow for optimized queries and permission handling

## Challenges

- Integrating Supabase Realtime authentication with Better Auth sessions
- Designing a scalable room membership system that supports both DMs and groups
- Managing real-time message ordering and conflict resolution
- Implementing optimistic updates that sync correctly with server state

## What I Learned

- Building real-time applications with WebSocket-based pub/sub systems
- Designing flexible chat architectures that scale from DMs to large groups
- Creating performant UIs that handle rapid message updates
- Managing complex state in real-time applications

## Summary

Wispr is a focused real-time messaging application that demonstrates modern full-stack development with Next.js, real-time communication, and clean UI design. It prioritizes direct communication over social features, providing a distraction-free messaging experience.
