import config from './config';
import * as icons from '../assets/icons';
import * as boom from '@hapi/boom';
import open from 'open';
import 'url-search-params-polyfill';

export const sendToBTT = async ({ text, iconData }: { text?: string; iconData?: string }) => {
  const uuid = config.get('uuid') as string;
  const bttSecret = config.get('bttSecret') as string;
  const baseUrl = 'btt://update_touch_bar_widget/';
  const searchParams = new URLSearchParams([ [ 'uuid', uuid ], [ 'sharedSecret', bttSecret ] ]);
  // don't want to send undefined as a param
  if (text) {
    searchParams.append('text', text);
  }
  if (iconData) {
    searchParams.append('icon_data', iconData);
  }
  const url = `${baseUrl}?${searchParams.toString()}`;
  try {
    return await open(url, { background: true, wait: false });
  } catch (e) {
    // if wait is false open is actually not going to throw anything. need to detect error via timeout
    // if wait is true, open only throws an error when the url scheme is not registered
    throw boom.badRequest(`Please install BetterTouchTool properly, or disable BarTime's BTT integration. `);
  }
};

export const resetBTT = async () => {
  const bttDefaultText = config.get('defaultText');
  return await sendToBTT({ text: bttDefaultText as string, iconData: icons.defaultIcon });
};
