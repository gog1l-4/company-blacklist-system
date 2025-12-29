import React from 'react';
import { TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, trend, color = 'primary' }) => {
    const colorClasses = {
        primary: 'from-primary-500 to-primary-600',
        success: 'from-emerald-500 to-emerald-600',
        warning: 'from-amber-500 to-amber-600',
        info: 'from-blue-500 to-blue-600',
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </div>
    );
};

const StatsCards = ({ stats }) => {
    if (!stats) {
        // Default stats
        stats = [
            {
                icon: Shield,
                label: 'ბაზაში კომპანიები',
                value: '450+',
                trend: '+12%',
                color: 'primary',
            },
            {
                icon: CheckCircle,
                label: 'ვერიფიცირებული',
                value: '100%',
                color: 'success',
            },
            {
                icon: Clock,
                label: 'ბოლო ძებნა',
                value: '2 წთ წინ',
                color: 'info',
            },
        ];
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatsCards;
