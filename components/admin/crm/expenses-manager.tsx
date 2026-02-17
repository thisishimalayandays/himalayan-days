'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addExpense, deleteExpense, updateExpense } from "@/app/actions/expenses";
import { toast } from "sonner";
import { Plus, Trash2, Calendar, Banknote, Tag, ArrowLeft, Pencil, X } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ExpensesManagerProps {
    bookingId: string;
    initialExpenses: any[];
    customerName?: string;
    bookingTitle?: string;
}

export function ExpensesManager({ bookingId, initialExpenses, customerName, bookingTitle }: ExpensesManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [expenses, setExpenses] = useState(initialExpenses);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("HOTEL");
    const [totalCost, setTotalCost] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("UPI");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleEdit = (expense: any) => {
        setEditingId(expense.id);
        setTitle(expense.title);
        setCategory(expense.category);
        setTotalCost(expense.totalCost?.toString() || "");
        setAmount(expense.amount.toString());
        setPaymentMode(expense.paymentMode);
        setDate(new Date(expense.date).toISOString().split('T')[0]);
        toast.info("Editing transaction...");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTitle("");
        setCategory("HOTEL");
        setTotalCost("");
        setAmount("");
        setPaymentMode("UPI");
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleAddExpense = () => {
        if (!title || !amount || !date) {
            toast.error("Please fill in all required fields");
            return;
        }

        startTransition(async () => {
            if (editingId) {
                const res = await updateExpense(editingId, {
                    title,
                    category,
                    totalCost: totalCost ? parseFloat(totalCost) : undefined,
                    amount: parseFloat(amount),
                    paymentMode,
                    date: new Date(date),
                });

                if (res.success) {
                    toast.success("Expense updated");
                    setExpenses(expenses.map(e => e.id === editingId ? res.expense : e));
                    handleCancelEdit();
                } else {
                    toast.error("Failed to update expense");
                }
            } else {
                const res = await addExpense({
                    bookingId,
                    title,
                    category,
                    totalCost: totalCost ? parseFloat(totalCost) : undefined,
                    amount: parseFloat(amount),
                    paymentMode,
                    date: new Date(date),
                });

                if (res.success) {
                    toast.success("Expense added");
                    setExpenses([res.expense, ...expenses]);

                    // Reset Form
                    setTitle("");
                    setAmount("");
                    setTotalCost("");
                } else {
                    toast.error("Failed to add expense");
                }
            }
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const res = await deleteExpense(id);
            if (res.success) {
                toast.success("Expense removed");
                setExpenses(expenses.filter(e => e.id !== id));
            } else {
                toast.error("Failed to remove expense");
            }
        });
    };

    const totalPaid = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Manage Expenses</h2>
                    <p className="text-muted-foreground">
                        {customerName ? `${customerName} • ` : ''}{bookingTitle || 'Booking Expenses'}
                    </p>
                </div>
                <Link href="/admin/bookings">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bookings
                    </Button>
                </Link>
            </div>

            <div className="space-y-8 py-4">
                {/* Summary Section */}
                <div className="flex items-center justify-between bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-baseline gap-3">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Expenses</div>
                        <div className="text-4xl font-bold tracking-tight text-foreground">₹{totalPaid.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full border shadow-sm">
                        <span className="font-semibold text-foreground">{expenses.length}</span> Transactions
                    </div>
                </div>

                {/* Add/Edit Transaction Form */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            {editingId ? <Pencil className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-primary" />}
                            <h4 className="text-sm font-semibold text-foreground">
                                {editingId ? "Edit Transaction" : "New Transaction"}
                            </h4>
                        </div>
                        {editingId && (
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 text-xs text-muted-foreground">
                                <X className="w-3 h-3 mr-1" /> Cancel
                            </Button>
                        )}
                    </div>

                    <div className="p-6 bg-card border rounded-xl shadow-sm space-y-6 md:space-y-0 md:flex md:items-end md:gap-6">
                        <div className="flex-1 space-y-2 min-w-[200px]">
                            <Label className="text-xs font-medium text-muted-foreground">Beneficiary Name</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Hotel Milan"
                                className="h-10 bg-background transition-colors"
                            />
                        </div>
                        <div className="w-[160px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-10 bg-background transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HOTEL">Hotel</SelectItem>
                                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[150px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-10 text-xs bg-background p-2"
                            />
                        </div>
                        <div className="w-[150px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Mode</Label>
                            <Select value={paymentMode} onValueChange={setPaymentMode}>
                                <SelectTrigger className="h-10 text-xs bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UPI">UPI / GPay</SelectItem>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[120px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Total (Opt)</Label>
                            <Input
                                type="number"
                                value={totalCost}
                                onChange={(e) => setTotalCost(e.target.value)}
                                placeholder="₹"
                                className="h-10 bg-background text-right"
                            />
                        </div>
                        <div className="w-[140px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Paid</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground text-xs">₹</span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="h-10 pl-6 bg-background font-medium text-right"
                                />
                            </div>
                        </div>
                        <div className="pb-[1px]">
                            <Button
                                className={`h-10 px-6 ${editingId ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                                onClick={handleAddExpense}
                                disabled={isPending}
                            >
                                {isPending ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update" : "Add")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Expenses Table */}
                <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="py-4">Date</TableHead>
                                <TableHead className="py-4">Beneficiary</TableHead>
                                <TableHead className="py-4">Category</TableHead>
                                <TableHead className="text-right py-4">Total Bill</TableHead>
                                <TableHead className="text-right py-4">Paid Amount</TableHead>
                                <TableHead className="text-right py-4">Balance</TableHead>
                                <TableHead className="w-[50px] py-4"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No expenses recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expenses.map((expense) => {
                                    const balance = expense.totalCost ? expense.totalCost - expense.amount : null;
                                    return (
                                        <TableRow key={expense.id}>
                                            <TableCell className="text-sm py-4">
                                                {format(new Date(expense.date), "dd MMM yyyy")}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-medium">{expense.title}</div>
                                                <div className="text-xs text-muted-foreground">{expense.paymentMode}</div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1 rounded-md w-fit font-medium border">
                                                    <Tag className="w-3 h-3" />
                                                    {expense.category}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground py-4">
                                                {expense.totalCost ? `₹${expense.totalCost.toLocaleString()}` : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-red-600 py-4">
                                                ₹{expense.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-medium py-4">
                                                {balance !== null ? (
                                                    <span className={balance > 0 ? "text-orange-600" : "text-green-600"}>
                                                        {balance > 0 ? `Pending: ₹${balance.toLocaleString()}` : "Paid"}
                                                    </span>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 mr-1"
                                                    onClick={() => handleEdit(expense)}
                                                    disabled={isPending}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDelete(expense.id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
