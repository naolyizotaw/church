/* eslint-disable react/prop-types */
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-[#1a2c32] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-primary/30 shadow-sm hover:-translate-y-1">
      <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-900">
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-lg px-3 py-2 flex flex-col items-center justify-center shadow-md z-10 border border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{announcement.month}</span>
          <span className="text-2xl font-black text-text-main dark:text-white leading-none mt-0.5">{announcement.day}</span>
        </div>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${announcement.image}')` }}
        ></div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1 bg-white dark:bg-[#1a2c32]">
        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 font-medium">
          <Clock size={14} className="text-primary" /> 
          <span>{announcement.time}</span>
        </div>
        <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors leading-tight">
          {announcement.title}
        </h3>
        <p className="text-sm text-text-muted dark:text-gray-300 line-clamp-2 leading-relaxed">
          {announcement.content}
        </p>
        <div className="mt-auto pt-4">
          <button className="text-sm font-bold text-primary flex items-center gap-1.5 group-hover:gap-2 transition-all">
            Learn More 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
