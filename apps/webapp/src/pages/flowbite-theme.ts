import type { CustomFlowbiteTheme } from 'flowbite-react';

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    color: {
      primary:
        'bg-primary-100 text-primary-800 dark:bg-primary-200 dark:text-primary-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-300',
    },
    icon: {
      off: 'rounded-full px-2 py-1',
    },
    size: {
      xl: 'px-3 py-2 text-base rounded-md',
    },
  },
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
  dropdown: {
    floating: {
      base: 'z-10 w-fit rounded p-2 w-28 divide-y divide-gray-100 shadow',
      content: 'rounded text-sm text-gray-700 dark:text-gray-200',
      target: 'w-fit dark:text-white',
    },
    content: '',
  },
  modal: {
    content: {
      inner: 'relative rounded-lg bg-white shadow dark:bg-gray-800',
    },
    header: {
      base: 'flex items-start justify-between rounded-t px-5 pt-5',
    },
  },
  navbar: {
    base: 'fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  },
  sidebar: {
    base: 'flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700',
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
    bar: 'space-x-2 rounded-full text-center font-medium leading-none text-cyan-300 dark:text-cyan-100',
    color: {
      dark: 'bg-gray-600 dark:bg-gray-300',
      blue: 'bg-blue-600',
      red: 'bg-red-600 dark:bg-red-500',
      green: 'bg-green-600 dark:bg-green-500',
      yellow: 'bg-yellow-400',
      indigo: 'bg-indigo-600 dark:bg-indigo-500',
      purple: 'bg-purple-600 dark:bg-purple-500',
      cyan: 'bg-cyan-600',
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
};

export default flowbiteTheme;
