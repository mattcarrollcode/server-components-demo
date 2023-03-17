/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {Suspense} from 'react';

import Note from './Note.server';
import NoteList from './NoteList.server';
import EditButton from './EditButton.client';
import SearchField from './SearchField.client';
import NoteSkeleton from './NoteSkeleton';
import NoteListSkeleton from './NoteListSkeleton';

export default function App({selectedId, isEditing, searchText}) {
  return (
    <div className="main">
      <section className="col sidebar">
        <section className="sidebar-header">
          <img
            className="logo"
            src="logo.svg"
            width="22px"
            height="20px"
            alt=""
            role="presentation"
          />
          <strong>React Notes</strong>
        </section>
        <section className="sidebar-menu" role="menubar">
          {/* Including client components in this JSX causes an server error to be thrown:
            ```
            Error: Attempted to call the default export of file:///PATH/TO/src/SearchField.client.js
            from the server but it's on the client. It's not possible to invoke a client function 
            from the server, it can only be rendered as a Component or passed to props of a Client Component.
            ```

            The client error shows a `TypeError: response.readRoot is not a function` which I think is because
            the client example a response from the server that includes the `readRoot` function
            but the client isn't getting a valid response because of the server error above.

            The server error may be related to me using `react-server-dom-webpack/client.edge` instead of 
            `react-server-dom-webpack/client.browser` in the `src/Cache.client.js` file.
            See my note in `src/Cache.client.js` for more info.
        
         */}
          <SearchField />
          <EditButton noteId={null}>New</EditButton>
        </section>
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <NoteList searchText={searchText} />
          </Suspense>
        </nav>
      </section>
      <section key={selectedId} className="col note-viewer">
        <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
          <Note selectedId={selectedId} isEditing={isEditing} />
        </Suspense>
      </section>
    </div>
  );
}
