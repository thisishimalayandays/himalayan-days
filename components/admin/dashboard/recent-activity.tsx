import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, User, Calendar } from "lucide-react";

export function RecentActivity({
    activities
}: {
    activities: {
        id: string;
        name: string;
        type: string;
        createdAt: Date;
        status: string;
    }[]
}) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No recent activity.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activities.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {item.type.replace(/_/g, " ")}
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge variant={item.status === 'NEW' ? 'default' : 'secondary'} className="mb-1 text-[10px]">
                            {item.status}
                        </Badge>
                        <Link href={`/admin/inquiries?id=${item.id}`} className="block">
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
