import { AngelNavigationItem } from '@angel/components/navigation';
import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types';
import { TYPE_ENVIRONMENT } from 'app/modules/business/business.types';
import { User } from 'app/modules/core/user/user.types';
import { Message } from '../../layout/common/messages/messages.types';
import { Notification } from '../../layout/common/notifications/notifications.types';
import { AppConfig } from './app.config';

export interface AppInitialData {
  appConfig: AppConfig;
  user: User;
  access_token?: string;
  inactive: boolean;
  inside: boolean;
  sign_in_visitor: boolean;
  query_environment?: TYPE_ENVIRONMENT;
  rememberMe: RememberMe;
  rememberMeVisitor: RememberMeVisitor;
  navigation: Navigation;
  messages?: Message[];
  notifications?: Notification[];
  shortcuts?: Shortcut[];
}

export interface Navigation {
  defaultNavigation: AngelNavigationItem[];
  compactNavigation: AngelNavigationItem[];
  futuristicNavigation: AngelNavigationItem[];
  horizontalNavigation: AngelNavigationItem[];
}

export interface RememberMe {
  enabled: boolean;
  user: string;
  password: string;
}

export interface RememberMeVisitor {
  enabled: boolean;
  buyer_identifier_voucher: string;
}

export interface MessageAPI {
  id: boolean;
  code: string;
  status: number;
  component: string;
  description: string;
  body?: any;
}
