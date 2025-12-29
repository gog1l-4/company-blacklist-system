import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    action
}) => {
    return (
        <div className="empty-state">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                {Icon ? (
                    <Icon className="w-10 h-10 text-slate-400" />
                ) : (
                    <AlertCircle className="w-10 h-10 text-slate-400" />
                )}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {title || 'მონაცემები ვერ მოიძებნა'}
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {description || 'სცადეთ სხვა ძიების პარამეტრები'}
            </p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};

export default EmptyState;
