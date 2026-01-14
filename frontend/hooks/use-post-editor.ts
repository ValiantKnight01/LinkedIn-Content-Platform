import { useState } from 'react';
import { Post, useCalendarStore } from '@/lib/store';

export function usePostEditor(post: Post) {
  const { researchPost, updatePost } = useCalendarStore();
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<Post>(post);
  const [isResearching, setIsResearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handlers
  const handleResearch = async () => {
    setIsResearching(true);
    await researchPost(post.id);
    setIsResearching(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updatePost(post.id, editData);
    setIsSaving(false);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/posts/${post.id}/export/pdf`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend Error:', response.status, errorText);
        throw new Error(`Download failed: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.title.replace(/\s+/g, '_')}_Carousel.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    const sections = (editData.sections || [])
      .map((s) => {
        let content = s.content || '';

        if (s.comparison) {
          content = 
            s.comparison.items
              .map(
                (item) => `• ${item.dimension}: ${item.before} → ${item.after}`
              )
              .join('\n') + 
            (s.comparison.summary ? `\n\n${s.comparison.summary}` : '');
        } else if (s.tradeoffs) {
          content = `PROS:\n${s.tradeoffs.pros.map((p) => `✓ ${p}`).join('\n')}\n\nCONS:\n${s.tradeoffs.cons.map((c) => `✗ ${c}`).join('\n')}\n\nCONSTRAINTS:\n${s.tradeoffs.constraints.map((c) => `→ ${c}`).join('\n')}${s.tradeoffs.real_world_context ? `\n\nReal-world: ${s.tradeoffs.real_world_context}` : ''}`;
        }

        return `\n${s.header.toUpperCase()}\n${content}${s.example_use_case ? `\n\nExample: ${s.example_use_case}` : ''}`;
      })
      .join('\n\n---\n');

    const takeaways = (editData.key_takeaways || [])
      .map((t) => `• ${t}`)
      .join('\n');

    const text = `${editData.hook || ''}\n\n${sections}\n\nKEY TAKEAWAYS\n${takeaways}\n\n${editData.call_to_action || ''}\n\n${(editData.hashtags || []).map((h) => `#${h}`).join(' ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    isOpen,
    setIsOpen,
    editData,
    setEditData,
    isResearching,
    isSaving,
    isDownloading,
    copied,
    handleResearch,
    handleSave,
    handleDownloadPDF,
    handleCopy,
  };
}
