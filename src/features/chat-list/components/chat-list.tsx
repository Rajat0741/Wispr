import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
  {
    username: "leerob",
    avatar: "https://github.com/leerob.png",
    email: "leerob@vercel.com",
  },
  {
    username: "timdorr",
    avatar: "https://github.com/timdorr.png",
    email: "timdorr@vercel.com",
  },
  {
    username: "samselamin",
    avatar: "https://github.com/samselamin.png",
    email: "samselamin@vercel.com",
  },
  {
    username: "rauchg",
    avatar: "https://github.com/rauchg.png",
    email: "rauchg@vercel.com",
  },
  {
    username: "gnoff",
    avatar: "https://github.com/gnoff.png",
    email: "gnoff@vercel.com",
  },
  {
    username: "delba",
    avatar: "https://github.com/delba.png",
    email: "delba@vercel.com",
  },
  {
    username: "styfle",
    avatar: "https://github.com/styfle.png",
    email: "styfle@vercel.com",
  },
  {
    username: "williamli",
    avatar: "https://github.com/williamli.png",
    email: "williamli@vercel.com",
  },
  {
    username: "jaredpalmer",
    avatar: "https://github.com/jaredpalmer.png",
    email: "jaredpalmer@vercel.com",
  },
];

export function ChatList() {
  return (
    <Command className="max-w-full h-screen overflow-y-auto border-r rounded-none border-r-border bg-background">
      <CommandInput placeholder="Search chats..." />
      <CommandList className="max-h-screen">
        <CommandEmpty>No chats found.</CommandEmpty>
        <CommandGroup>
          {people.map((person) => (
            <CommandItem
              key={person.username}
              value={person.username}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage src={person.avatar} className="grayscale" />
                <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{person.username}</span>
                <span className="text-xs text-muted-foreground">
                  {person.email}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
