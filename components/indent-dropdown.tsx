'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CheckIcon, ChevronDownIcon, IndentIncreaseIcon } from 'lucide-react';

export function IndentDropdown({
  indentSize,
  setIndentSize
}: {
  indentSize: number;
  setIndentSize: (size: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <IndentIncreaseIcon className="size-3.5" />
          {indentSize}
          <span className="hidden sm:inline"> spaces</span>
          <ChevronDownIcon className="size-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuLabel>Indent Size</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[2, 4, 8].map((size) => (
          <DropdownMenuItem key={size} onClick={() => setIndentSize(size)} className="gap-3">
            <span className="flex-1">{size} spaces</span>
            {size === indentSize && <CheckIcon className="text-primary size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
