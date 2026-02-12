'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Phone, Calendar as CalendarIcon, MapPin, Trash2, RefreshCcw, MessageCircle, Copy, Check, ChevronDown, ChevronUp, User, Wallet, Users } from 'lucide-react';
import { StatusSelector } from './status-selector';
import { NotesDialog } from './notes-dialog';
import { logActivity } from '@/app/actions/audit';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Duplicate Inquiry interface to avoid circular imports or complex refactors for now
interface Inquiry {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    type: string;
    status: string;
    startDate: Date | null;
    destination: string | null;
    message: string | null;
    travelers: number | null;
    budget: string | null;
    createdAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    isRead: boolean;
    notes: string | null;
    followUpDate: Date | null;
}

interface InquiryMobileCardProps {
    inquiry: Inquiry;
    isTrash?: boolean;
    onMarkAsRead: (id: string, currentStatus: boolean) => void;
    onSoftDelete: (id: string, e: React.MouseEvent) => void;
    onRestore: (id: string, e: React.MouseEvent) => void;
    onPermanentDelete: (id: string, e: React.MouseEvent) => void;
    userEmail?: string;
    role?: string;
}

export function InquiryMobileCard({ inquiry, isTrash = false, onMarkAsRead, onSoftDelete, onRestore, onPermanentDelete, userEmail, role }: InquiryMobileCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const text = `*Lead Details* 📋\nName: ${inquiry.name}\nPhone: ${inquiry.phone}\n${inquiry.startDate ? `Travel: ${new Date(inquiry.startDate).toLocaleDateString('en-GB')}` : ''}\n${inquiry.travelers ? `Guests: ${inquiry.travelers}` : ''}\n${inquiry.budget ? `Budget: ${inquiry.budget}` : ''}\n${inquiry.message ? `Note: ${inquiry.message}` : ''}`;
        navigator.clipboard.writeText(text);
        logActivity('COPIED_LEAD', 'Inquiry', inquiry.id, `Copied lead details for ${inquiry.name}`);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Lead details copied to clipboard."
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const TypeBadge = ({ type }: { type: string }) => {
        if (type === 'PACKAGE_BOOKING') {
            return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-2 py-0.5 text-[10px] h-auto font-medium">Package Booking</Badge>;
        }
        if (type === 'PLAN_MY_TRIP') {
            return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-full px-2 py-0.5 text-[10px] h-auto font-medium">Plan My Trip</Badge>;
        }
        if (type === 'AI_WIZARD_LEAD') {
            return <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-none rounded-full px-2 py-0.5 text-[10px] h-auto font-medium">AI Wizard</Badge>;
        }
        if (type === 'GENERAL') {
            return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 rounded-full px-2 py-0.5 text-[10px] h-auto font-medium">WhatsApp</Badge>;
        }
        return (
            <Badge variant="outline" className="capitalize whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] h-auto text-muted-foreground border-border">
                {type.replace(/_/g, ' ').toLowerCase()}
            </Badge>
        );
    };

    return (
        <Card
            className={cn(
                "mb-3 overflow-hidden transition-all border-l-4",
                !isTrash && !inquiry.isRead ? "border-l-brand-primary bg-orange-50/10 dark:bg-orange-950/20" : "border-l-transparent",
                isTrash && "opacity-75 bg-muted/30"
            )}
            onClick={() => !isTrash && onMarkAsRead(inquiry.id, inquiry.isRead)}
        >
            <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col">
                            <h3 className={cn("font-semibold text-sm flex items-center gap-2", !isTrash && !inquiry.isRead ? "text-foreground" : "text-muted-foreground")}>
                                {inquiry.name}
                                {!isTrash && !inquiry.isRead && (
                                    <span className="inline-block w-2 h-2 bg-brand-primary rounded-full animate-pulse" title="New Inquiry"></span>
                                )}
                            </h3>
                            <span className="text-[10px] text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString('en-GB')} • {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <StatusSelector id={inquiry.id} status={inquiry.status} isTrash={isTrash} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <div className="flex flex-wrap gap-2 mb-3 mt-1 text-xs text-muted-foreground items-center">
                    <TypeBadge type={inquiry.type} />

                    {/* Quick Contacts */}
                    <div className="flex items-center gap-2 ml-auto">
                        <a href={`tel:${inquiry.phone}`} onClick={e => e.stopPropagation()} className="p-1.5 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => {
                                e.stopPropagation();
                                logActivity('CLICKED_WHATSAPP', 'Inquiry', inquiry.id, `Clicked WhatsApp for ${inquiry.name}`);
                            }}
                            className="p-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                    <div className="space-y-3 pt-2 border-t border-border/50 text-sm animate-in slide-in-from-top-1 duration-200">
                        {/* Trip Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {inquiry.startDate && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <CalendarIcon className="w-3 h-3 text-blue-500" />
                                    <span>{new Date(inquiry.startDate).toLocaleDateString('en-GB')}</span>
                                </div>
                            )}
                            {inquiry.travelers && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Users className="w-3 h-3 text-orange-500" />
                                    <span>{inquiry.travelers} Guests</span>
                                </div>
                            )}
                            {inquiry.budget && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Wallet className="w-3 h-3 text-green-500" />
                                    <span>{inquiry.budget}</span>
                                </div>
                            )}
                            {inquiry.destination && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="w-3 h-3 text-red-500" />
                                    <span>{inquiry.destination}</span>
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        {inquiry.message && (
                            <div className="bg-muted/30 p-2 rounded text-[11px] leading-relaxed border border-border/50 whitespace-pre-wrap">
                                {inquiry.message.replace('Booking Inquiry for Package:', '').trim()}
                            </div>
                        )}

                        {/* Actions Footer */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                {!isTrash && (
                                    <NotesDialog
                                        inquiryId={inquiry.id}
                                        existingNotes={inquiry.notes}
                                        customerName={inquiry.name}
                                        userEmail={userEmail}
                                    />
                                )}
                                {!isTrash && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopy}
                                        className={cn("h-8 px-2 text-xs", copied ? "text-green-600 bg-green-50" : "text-muted-foreground")}
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                {isTrash ? (
                                    <>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-green-600" onClick={(e) => onRestore(inquiry.id, e)}>
                                            <RefreshCcw className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600" onClick={(e) => onPermanentDelete(inquiry.id, e)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                ) : (
                                    role !== 'SALES' && (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={(e) => onSoftDelete(inquiry.id, e)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="w-full flex items-center justify-center pt-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </CardContent>
        </Card>
    );
}
