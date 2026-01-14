'use client';

import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useCalendarStore } from '@/lib/store';
import { PostIndicator } from './post-indicator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Calendar() {
  const { currentDate, posts, fetchPosts, nextMonth, prevMonth } =
    useCalendarStore();

  useEffect(() => {
    fetchPosts();
  }, [currentDate, fetchPosts]);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = currentDate.daysInMonth();

  // Get the day of the week the month starts on (0=Sun, 6=Sat)
  const startDay = startOfMonth.day();

  // Previous month days to fill the grid
  const prevMonthDays = [];
  const prevMonthEnd = startOfMonth.subtract(1, 'day');
  for (let i = startDay - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthEnd.subtract(i, 'day'));
  }

  // Current month days
  const currentMonthDays = [];
  for (let i = 0; i < daysInMonth; i++) {
    currentMonthDays.push(startOfMonth.add(i, 'day'));
  }

  // Next month days to fill the grid (total 42 cells for 6 weeks or 35 for 5)
  // Reference seems to use 5 or 6 rows. I'll aim for 42 to be safe.
  const nextMonthDays = [];
  const totalCells = 42;
  const remainingCells =
    totalCells - (prevMonthDays.length + currentMonthDays.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(endOfMonth.add(i, 'day'));
  }

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Calendar Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-foreground font-serif text-4xl font-bold tracking-tight">
          {currentDate.format('MMMM YYYY')} Calendar
        </h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={prevMonth}
            className="border-primary/20 bg-secondary/30 text-foreground/80 hover:bg-secondary/50 h-12 min-w-[160px] rounded-full px-8"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {currentDate.subtract(1, 'month').format('MMMM')}
          </Button>
          <Button
            variant="outline"
            onClick={nextMonth}
            className="border-primary/20 bg-secondary/30 text-foreground/80 hover:bg-secondary/50 h-12 min-w-[160px] rounded-full px-8"
          >
            {currentDate.add(1, 'month').format('MMMM')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-background border-primary/20 overflow-hidden rounded-[2rem] border shadow-sm">
        {/* Weekday Labels */}
        <div className="border-primary/20 bg-secondary/10 grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-foreground/60 py-5 text-center text-xs font-bold tracking-[0.2em] uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {allDays.map((day, idx) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const dayPosts = posts.filter((p) =>
              dayjs(p.date).isSame(day, 'day')
            );

            return (
              <div
                key={idx}
                className={cn(
                  'border-primary/10 flex min-h-[160px] flex-col gap-3 border-r border-b p-4 last:border-r-0',
                  !isCurrentMonth && 'bg-black/[0.01]'
                )}
              >
                <span
                  className={cn(
                    'self-end pr-2 text-3xl font-bold',
                    isCurrentMonth ? 'text-foreground/80' : 'text-foreground/10'
                  )}
                >
                  {day.date()}
                </span>
                <div className="mt-auto flex flex-col gap-2">
                  {dayPosts.map((post) => (
                    <PostIndicator key={post.id} post={post} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
