/* eslint-disable react/prop-types */
import React from 'react';
import { Schedule, ChevronRight } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
  return (
    <div className="group flex flex-col bg-background-light dark:bg-[#1a2c32] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur rounded px-3 py-1 flex flex-col items-center justify-center shadow-sm z-10">
          <span className="text-xs font-bold text-primary uppercase">{announcement.month}</span>
          <span className="text-xl font-black text-text-main dark:text-white leading-none">{announcement.day}</span>
        </div>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${announcement.image}')` }}
        ></div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
          <Schedule size={14} /> {announcement.time}
        </div>
        <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{announcement.title}</h3>
        <p className="text-sm text-text-muted dark:text-gray-300 line-clamp-2">{announcement.content}</p>
        <div className="mt-auto pt-4">
          <span className="text-sm font-bold text-primary flex items-center gap-1">
            Learn More <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
