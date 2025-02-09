import type { CustomFlowbiteTheme } from 'flowbite-react';

const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary:
        'text-white bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800',
    },
    outline: {
      on: 'transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit',
    },
    size: {
      md: 'text-sm px-3 py-2',
    },
  },
  textInput: {
    base: 'flex',
    addon:
      'inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400',
    field: {
      base: 'relative w-full',
      icon: {
        base: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
        svg: 'h-5 w-5 text-gray-500 dark:text-gray-400',
      },
      rightIcon: {
        base: 'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3',
        svg: 'h-5 w-5 text-gray-500 dark:text-gray-400',
      },
      input: {
        base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50',
        sizes: {
          sm: 'p-2 sm:text-xs',
          md: 'p-2.5 text-sm',
          lg: 'p-4 sm:text-base',
        },
        colors: {
          gray: 'border-gray-300 bg-gray-50 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500',
          info: 'border-emerald-500 bg-emerald-50 text-emerald-900 placeholder-emerald-700 focus:border-emerald-500 focus:ring-emerald-500 dark:border-emerald-400 dark:bg-emerald-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500',
          failure:
            'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500',
          warning:
            'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500',
          success:
            'border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500',
        },
        withRightIcon: {
          on: 'pr-10',
          off: '',
        },
        withIcon: {
          on: 'pl-10',
          off: '',
        },
        withAddon: {
          on: 'rounded-r-lg',
          off: 'rounded',
        },
        withShadow: {
          on: 'shadow-sm dark:shadow-sm-light',
          off: '',
        },
      },
    },
  },
  datepicker: {
    root: {
      base: 'relative',
    },
    popup: {
      root: {
        base: 'absolute top-10 z-50 block pt-2',
        inline: 'relative top-0 z-auto',
        inner:
          'inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700',
      },
      header: {
        base: '',
        title:
          'px-2 py-3 text-center font-semibold text-gray-900 dark:text-white',
        selectors: {
          base: 'mb-2 flex justify-between',
          button: {
            base: 'rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
            prev: '',
            next: '',
            view: '',
          },
        },
      },
      view: {
        base: 'p-1',
      },
      footer: {
        base: 'mt-2 flex space-x-2',
        button: {
          base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-emerald-300',
          today:
            'bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700',
          clear:
            'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
        },
      },
    },
    views: {
      days: {
        header: {
          base: 'mb-1 grid grid-cols-7',
          title:
            'h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400',
        },
        items: {
          base: 'grid w-64 grid-cols-7',
          item: {
            base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600',
            selected: 'bg-emerald-700 text-white hover:bg-emerald-600',
            disabled: 'text-gray-500',
          },
        },
      },
      months: {
        items: {
          base: 'grid w-64 grid-cols-4',
          item: {
            base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600',
            selected: 'bg-emerald-700 text-white hover:bg-emerald-600',
            disabled: 'text-gray-500',
          },
        },
      },
      years: {
        items: {
          base: 'grid w-64 grid-cols-4',
          item: {
            base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600',
            selected: 'bg-emerald-700 text-white hover:bg-emerald-600',
            disabled: 'text-gray-500',
          },
        },
      },
      decades: {
        items: {
          base: 'grid w-64 grid-cols-4',
          item: {
            base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600',
            selected: 'bg-emerald-700 text-white hover:bg-emerald-600',
            disabled: 'text-gray-500',
          },
        },
      },
    },
  },
  dropdown: {
    floating: {
      base: 'z-10 w-fit rounded p-2 w-28 divide-y divide-gray-100 shadow',
      content: 'rounded text-sm text-gray-700 dark:text-gray-200',
      target: 'w-fit dark:text-white',
    },
    content: '',
  },
  modal: {
    root: {
      base: 'fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full',
      show: {
        on: 'flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80',
        off: 'hidden',
      },
      sizes: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
      },
      positions: {
        'top-left': 'items-start justify-start',
        'top-center': 'items-start justify-center',
        'top-right': 'items-start justify-end',
        'center-left': 'items-center justify-start',
        center: 'items-center justify-center',
        'center-right': 'items-center justify-end',
        'bottom-right': 'items-end justify-end',
        'bottom-center': 'items-end justify-center',
        'bottom-left': 'items-end justify-start',
      },
    },
    content: {
      base: 'relative h-full w-full p-4 md:h-auto',
      inner:
        'relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700',
    },
    body: {
      base: 'flex-1 overflow-auto',
      popup: 'pt-0',
    },
    header: {
      base: 'flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600',
      popup: 'border-b-0 p-2',
      title: 'text-xl font-medium text-gray-900 dark:text-white',
      close: {
        base: 'ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
        icon: 'h-5 w-5',
      },
    },
    footer: {
      base: 'flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600',
      popup: 'border-t',
    },
  },
  textarea: {
    base: 'block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50',
  },
  toggleSwitch: {
    toggle: {
      checked: {
        off: '!border-gray-200 !bg-gray-200 dark:!border-gray-600 dark:!bg-gray-700',
      },
    },
  },
  tooltip: {
    target: 'w-fit',
    animation: 'transition-opacity',
    arrow: {
      base: 'absolute z-10 h-2 w-2 rotate-45',
      style: {
        dark: 'bg-gray-900 dark:bg-gray-700',
        light: 'bg-white',
        auto: 'bg-white dark:bg-gray-700',
      },
      placement: '-4px',
    },
    base: 'absolute z-10 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm',
    hidden: 'invisible opacity-0',
    style: {
      dark: 'bg-gray-900 text-white dark:bg-gray-700',
      light: 'border border-gray-200 bg-white text-gray-900',
      auto: 'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white',
    },
    content: 'relative z-20',
  },
  progress: {
    base: 'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
    label: 'mb-1 flex justify-between font-medium dark:text-white',
    bar: 'space-x-2 rounded-full text-center font-medium leading-none text-emerald-300 dark:text-emerald-100',
    color: {
      dark: 'bg-gray-600 dark:bg-gray-300',
      blue: 'bg-blue-600',
      red: 'bg-red-600 dark:bg-red-500',
      green: 'bg-green-600 dark:bg-green-500',
      yellow: 'bg-yellow-400',
      indigo: 'bg-indigo-600 dark:bg-indigo-500',
      purple: 'bg-purple-600 dark:bg-purple-500',
      emerald: 'bg-emerald-600',
      gray: 'bg-gray-500',
      lime: 'bg-lime-600',
      pink: 'bg-pink-500',
      teal: 'bg-teal-600',
    },
    size: {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
      xl: 'h-6',
    },
  },
  floatingLabel: {
    input: {
      default: {
        filled: {
          sm: 'peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-xs text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500',
          md: 'peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500',
        },
        outlined: {
          sm: 'peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-xs text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500',
          md: 'peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500',
        },
        standard: {
          sm: 'peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-xs text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500',
          md: 'peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500',
        },
      },
      success: {
        filled: {
          sm: 'peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-green-600 bg-gray-50 px-2.5 pb-2.5 pt-5 text-xs text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:border-green-500',
          md: 'peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-green-600 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:border-green-500',
        },
        outlined: {
          sm: 'peer block w-full appearance-none rounded-lg border border-green-600 bg-transparent px-2.5 pb-2.5 pt-4 text-xs text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-green-500 dark:text-white dark:focus:border-green-500',
          md: 'peer block w-full appearance-none rounded-lg border border-green-600 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-green-500 dark:text-white dark:focus:border-green-500',
        },
        standard: {
          sm: 'peer block w-full appearance-none border-0 border-b-2 border-green-600 bg-transparent px-0 py-2.5 text-xs text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-green-500 dark:text-white dark:focus:border-green-500',
          md: 'peer block w-full appearance-none border-0 border-b-2 border-green-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-0 dark:border-green-500 dark:text-white dark:focus:border-green-500',
        },
      },
      error: {
        filled: {
          sm: 'peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-red-600 bg-gray-50 px-2.5 pb-2.5 pt-5 text-xs text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-red-500 dark:bg-gray-700 dark:text-white dark:focus:border-red-500',
          md: 'peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-red-600 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-red-500 dark:bg-gray-700 dark:text-white dark:focus:border-red-500',
        },
        outlined: {
          sm: 'peer block w-full appearance-none rounded-lg border border-red-600 bg-transparent px-2.5 pb-2.5 pt-4 text-xs text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-red-500 dark:text-white dark:focus:border-red-500',
          md: 'peer block w-full appearance-none rounded-lg border border-red-600 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-red-500 dark:text-white dark:focus:border-red-500',
        },
        standard: {
          sm: 'peer block w-full appearance-none border-0 border-b-2 border-red-600 bg-transparent px-0 py-2.5 text-xs text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-red-500 dark:text-white dark:focus:border-red-500',
          md: 'peer block w-full appearance-none border-0 border-b-2 border-red-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-red-500 dark:text-white dark:focus:border-red-500',
        },
      },
    },
    label: {
      default: {
        filled: {
          sm: 'absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-xs text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500',
          md: 'absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-sm text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500',
        },
        outlined: {
          sm: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-xs text-gray-500 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500',
          md: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500',
        },
        standard: {
          sm: 'absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-xs text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500',
          md: 'absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500',
        },
      },
      success: {
        filled: {
          sm: 'absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-sm text-green-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 dark:text-green-500',
          md: 'absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-sm text-green-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 dark:text-green-500',
        },
        outlined: {
          sm: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-green-600 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 dark:text-green-500',
          md: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-green-600 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 dark:text-green-500',
        },
        standard: {
          sm: 'absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-xs text-green-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 dark:text-green-500',
          md: 'absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-green-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 dark:text-green-500',
        },
      },
      error: {
        filled: {
          sm: 'absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-xs text-red-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 dark:text-red-500',
          md: 'absolute left-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 text-xs text-red-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 dark:text-red-500',
        },
        outlined: {
          sm: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-xs text-red-600 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 dark:text-red-500',
          md: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-xs text-red-600 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-900 dark:text-red-500',
        },
        standard: {
          sm: 'absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-xs text-red-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 dark:text-red-500',
          md: 'absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-red-600 transition-transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 dark:text-red-500',
        },
      },
    },
    helperText: {
      default: 'mt-2 text-xs text-gray-600 dark:text-gray-400',
      success: 'mt-2 text-xs text-green-600 dark:text-green-400',
      error: 'mt-2 text-xs text-red-600 dark:text-red-400',
    },
  },
  card: {
    root: {
      base: 'flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800',
      children: 'flex h-full flex-col justify-center gap-4 p-6',
      horizontal: {
        off: 'flex-col',
        on: 'flex-col md:max-w-xl md:flex-row',
      },
      href: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    },
    img: {
      base: '',
      horizontal: {
        off: 'rounded-t-lg',
        on: 'h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg',
      },
    },
  },
  accordion: {
    root: {
      base: 'divide-y divide-gray-200 border-gray-200 dark:divide-gray-700 dark:border-gray-700',
      flush: {
        off: 'rounded-lg border',
        on: 'border-b',
      },
    },
    content: {
      base: 'p-5 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-900',
    },
    title: {
      arrow: {
        base: 'h-6 w-6 shrink-0',
        open: {
          off: '',
          on: 'rotate-180',
        },
      },
      base: 'flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400',
      flush: {
        off: 'hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800',
        on: 'bg-transparent dark:bg-transparent',
      },
      heading: '',
      open: {
        off: '',
        on: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white',
      },
    },
  },
  spinner: {
    base: 'inline animate-spin text-gray-200',
    color: {
      failure: 'fill-red-600',
      gray: 'fill-gray-600',
      info: 'fill-cyan-600',
      pink: 'fill-pink-600',
      purple: 'fill-purple-600',
      success: 'fill-green-500',
      warning: 'fill-yellow-400',
    },
    light: {
      off: {
        base: 'dark:text-gray-600',
        color: {
          failure: '',
          gray: 'dark:fill-gray-300',
          info: '',
          pink: '',
          purple: '',
        },
      },
      on: {
        base: '',
        color: {
          failure: '',
          gray: '',
          info: '',
          pink: '',
          purple: '',
          success: '',
          warning: '',
        },
      },
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
    },
  },
};

export default flowbiteTheme;
