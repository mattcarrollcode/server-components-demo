/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use client';

import {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  unstable_useCacheRefresh,
} from 'react';
// importing `createFromFetch` from  `react-server-dom-webpack/client.edge/client.browser`
// is what I think should be imported here because this is a client component
// but it causes webpack to bundle too many things.
// See: https://stackoverflow.com/questions/75711604/cannot-bundle-for-react-server-dom-webpack
import {createFromFetch} from 'react-server-dom-webpack/client.edge';

function createResponseCache() {
  return new Map();
}

export function useRefresh() {
  const refreshCache = unstable_useCacheRefresh();
  return function refresh(key, seededResponse) {
    refreshCache(createResponseCache, new Map([[key, seededResponse]]));
  };
}

export function useServerResponse(location) {
  const key = JSON.stringify(location);
  const dispatcher =
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentCache
      .current;
  const cache = dispatcher.getCacheForType(createResponseCache);
  let response = cache.get(key);
  if (response) {
    return response;
  }
  response = createFromFetch(
    fetch('/react?location=' + encodeURIComponent(key))
  );
  cache.set(key, response);
  return response;
}
