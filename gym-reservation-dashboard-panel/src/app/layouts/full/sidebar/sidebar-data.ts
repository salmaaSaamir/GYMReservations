import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
 
  {
    divider: true,
    navCap: ' ',
  },
  {
    displayName: 'Users',
    iconName: 'solar:chat-round-line-line-duotone',
    route: '/components/users',
    // chip: true,
    // external: true,
    // chipClass: 'bg-light-secondary text-secondary',
    // chipContent: 'PRO',
  },
  {
    displayName: 'Trainers',
    iconName: 'solar:calendar-mark-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/calendar',
    // chip: true,
    // external: true,
    // chipClass: 'bg-light-secondary text-secondary',
    // chipContent: 'PRO',
  },
  {
    displayName: 'Members',
    iconName: 'solar:letter-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/email/inbox',
    // chip: true,
    // external: true,
    // chipClass: 'bg-light-secondary text-secondary',
    // chipContent: 'PRO',
  },
  {
    displayName: 'Classes',
    iconName: 'solar:clapperboard-edit-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/kanban',
    // chip: true,
    // external: true,
    // chipClass: 'bg-light-secondary text-secondary',
    // chipContent: 'PRO',
  },
  {
    displayName: 'Reservations',
    iconName: 'solar:phone-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/contacts',
    // chip: true,
    // external: true,
    // chipClass: 'bg-light-secondary text-secondary',
    // chipContent: 'PRO',
  },
  {
    displayName: 'ContactsApp',
    iconName: 'solar:phone-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/contact-list',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
    chipContent: 'PRO',
  },
  {
    displayName: 'Courses',
    iconName: 'solar:book-bookmark-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/courses',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
    chipContent: 'PRO',
  },
  {
    displayName: 'Employee',
    iconName: 'solar:user-id-line-duotone',
    route: 'https://matdash-angular-main.netlify.app/apps/employee',
    // chip: false,
    // external: true,
    // chipClass: 'bg-light-secondary text-secondary',
    // chipContent: 'PRO',
  },
 
  
];
