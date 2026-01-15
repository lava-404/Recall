type NotePreviewProps = {
  title: string
  message: string
}

export default function NotePreview({ title, message }: NotePreviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm bg-white dark:bg-slate-950">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      <div
        className="text-sm text-slate-700 dark:text-slate-300"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  )
}
