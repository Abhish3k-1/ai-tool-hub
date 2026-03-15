"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface DeleteResumeButtonProps {
    resumeId?: string;
    onDelete?: () => void;
}

export default function DeleteResumeButton({ resumeId, onDelete }: DeleteResumeButtonProps) {
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            if (!resumeId) {
                console.error("Delete failed: missing resume id.");
                return;
            }

            const supabase = createClient();
            const { data: deletedRows, error: deleteError } = await supabase
                .from("resume")
                .delete()
                .eq("id", resumeId)
                .select("id");

            if (deleteError) {
                console.error("Delete failed:", deleteError.message ?? deleteError);
                return;
            }
            if (!deletedRows || deletedRows.length === 0) {
                console.error("Delete failed: no matching resume row found in database.");
                return;
            }

            if (onDelete) {
                onDelete();
            } else {
                router.push("/tools/resume/templates");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };


    return (
        <>
            <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
            >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
            </button>

            {/* Delete Confirmation Modal */}
            {mounted && typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {showDeleteModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        >
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => !deleting && setShowDeleteModal(false)}
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.4 }}
                                className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#130f24] p-6 shadow-2xl"
                            >
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                                        <Trash2 className="h-7 w-7 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            Delete Resume?
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-400">
                                            This will permanently delete your saved resume.
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="flex w-full gap-3 mt-2">
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            disabled={deleting}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteConfirm}
                                            disabled={deleting}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            {deleting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
