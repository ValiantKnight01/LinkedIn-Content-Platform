'use client';

import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useCalendarStore } from '@/lib/store';
import { PostIndicator } from './post-indicator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Calendar() {
  const { currentDate, posts, fetchPosts, nextMonth, prevMonth } = useCalendarStore();

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
  const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(endOfMonth.add(i, 'day'));
  }
  
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-4xl font-serif font-bold text-foreground tracking-tight">
          {currentDate.format('MMMM YYYY')} Calendar
        </h2>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={prevMonth}
            className="rounded-full h-12 px-8 min-w-[160px] border-primary/20 bg-secondary/30 text-foreground/80 hover:bg-secondary/50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentDate.subtract(1, 'month').format('MMMM')}
          </Button>
          <Button 
            variant="outline" 
            onClick={nextMonth}
            className="rounded-full h-12 px-8 min-w-[160px] border-primary/20 bg-secondary/30 text-foreground/80 hover:bg-secondary/50"
          >
            {currentDate.add(1, 'month').format('MMMM')}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-background rounded-[2rem] border border-primary/20 overflow-hidden shadow-sm">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 border-b border-primary/20 bg-secondary/10">
          {weekDays.map((day) => (
            <div key={day} className="py-5 text-center font-bold text-xs text-foreground/60 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {allDays.map((day, idx) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const dayPosts = posts.filter(p => dayjs(p.date).isSame(day, 'day'));
            
            return (
              <div 
                key={idx} 
                className={cn(
                  "min-h-[160px] p-4 border-r border-b border-primary/10 last:border-r-0 flex flex-col gap-3",
                  !isCurrentMonth && "bg-black/[0.01]"
                )}
              >
                <span className={cn(
                  "text-3xl font-bold self-end pr-2",
                  isCurrentMonth ? "text-foreground/80" : "text-foreground/10"
                )}>
                  {day.date()}
                </span>
                <div className="flex flex-col gap-2 mt-auto">
                  {dayPosts.map(post => (
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
