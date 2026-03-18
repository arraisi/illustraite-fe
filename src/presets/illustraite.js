export default {
  button: {
    root: ({ props }) => ({
      class: [
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        {
          'bg-[#fe9a00] text-white shadow-sm hover:brightness-110 focus:ring-[#fe9a00]/50':
            !props.severity || props.severity === 'primary',
          'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700':
            props.severity === 'secondary',
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400':
            props.severity === 'danger',
          'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800':
            props.text,
          'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800':
            props.outlined,
        },
      ],
    }),
    label: { class: 'font-semibold' },
    icon: { class: 'text-base' },
    loadingIcon: { class: 'animate-spin text-base' },
  },

  inputtext: {
    root: {
      class:
        'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#fe9a00] focus:outline-none focus:ring-2 focus:ring-[#fe9a00]/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#fe9a00]',
    },
  },

  password: {
    root: { class: 'relative w-full' },
    pcInputText: {
      root: {
        class:
          'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#fe9a00] focus:outline-none focus:ring-2 focus:ring-[#fe9a00]/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#fe9a00]',
      },
    },
    maskIcon: { class: 'absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400' },
    unmaskIcon: { class: 'absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400' },
  },

  progressspinner: {
    root: { class: 'relative mx-auto h-12 w-12' },
    spin: { class: 'animate-spin stroke-[#fe9a00]' },
    circle: { class: 'stroke-current' },
  },

  textarea: {
    root: {
      class:
        'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#fe9a00] focus:outline-none focus:ring-2 focus:ring-[#fe9a00]/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#fe9a00]',
    },
  },

  select: {
    root: {
      class:
        'inline-flex w-full cursor-pointer items-center rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600',
    },
    label: {
      class: 'block truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100',
    },
    dropdown: {
      class: 'flex items-center justify-center px-3 text-gray-400',
    },
    dropdownIcon: { class: 'h-4 w-4' },
    overlay: {
      class:
        'mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900',
    },
    list: { class: 'py-1' },
    option: ({ context }) => ({
      class: [
        'cursor-pointer px-4 py-2.5 text-sm transition',
        {
          'bg-[#fe9a00]/10 text-[#fe9a00] dark:bg-[#fe9a00]/20': context.selected,
          'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800':
            !context.selected,
        },
      ],
    }),
    optionLabel: { class: 'leading-normal' },
    emptyMessage: {
      class: 'px-4 py-3 text-sm text-gray-400',
    },
  },

  toast: {
    root: { class: 'pointer-events-none fixed z-50 flex w-96 flex-col gap-3 p-4' },
    message: ({ props }) => ({
      class: [
        'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg',
        {
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950':
            props.message?.severity === 'success',
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950':
            props.message?.severity === 'info',
          'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950':
            props.message?.severity === 'warn',
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950':
            props.message?.severity === 'error',
        },
      ],
    }),
    messageContent: { class: 'flex flex-1 items-start gap-3' },
    messageIcon: { class: 'mt-0.5 h-5 w-5 shrink-0' },
    messageText: { class: 'flex-1' },
    summary: { class: 'text-sm font-semibold text-gray-900 dark:text-gray-100' },
    detail: { class: 'mt-0.5 text-sm text-gray-600 dark:text-gray-400' },
    closeButton: {
      class:
        'ml-auto shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800',
    },
    closeIcon: { class: 'h-4 w-4' },
  },

  skeleton: {
    root: ({ props }) => ({
      class: [
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        {
          'rounded-full': props.shape === 'circle',
          'rounded-xl': props.shape !== 'circle',
        },
      ],
    }),
  },

  dataview: {
    root: { class: '' },
    header: {
      class: 'mb-4 flex items-center justify-between',
    },
    content: { class: 'grid gap-6' },
    emptyMessage: {
      class: 'py-12 text-center text-sm text-gray-400',
    },
    footer: { class: 'mt-4' },
  },

  image: {
    root: { class: 'relative inline-block' },
    original: { class: 'rounded-xl' },
    previewMask: {
      class:
        'absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-black/40 opacity-0 transition hover:opacity-100',
    },
    previewIcon: { class: 'h-6 w-6 text-white' },
    mask: {
      class: 'fixed inset-0 z-50 flex items-center justify-center bg-black/80',
    },
    toolbar: {
      class: 'absolute right-4 top-4 flex gap-2',
    },
    rotateLeftButton: {
      class: 'rounded-lg bg-white/20 p-2 text-white transition hover:bg-white/30',
    },
    rotateRightButton: {
      class: 'rounded-lg bg-white/20 p-2 text-white transition hover:bg-white/30',
    },
    zoomInButton: {
      class: 'rounded-lg bg-white/20 p-2 text-white transition hover:bg-white/30',
    },
    zoomOutButton: {
      class: 'rounded-lg bg-white/20 p-2 text-white transition hover:bg-white/30',
    },
    closeButton: {
      class: 'rounded-lg bg-white/20 p-2 text-white transition hover:bg-white/30',
    },
  },
};
