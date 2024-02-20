/*    NEXT-AUTH V4      */
import { authOptions } from '@/utils/auth';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// // we do not have to create GET and POST methods one by one as our library would handle everything for us.

/*    NEXT-AUTH V5      */
// import {GET, POST} from '../../../../../auth'
// Alternatively, instead of importing it like this import {GET, POST} from '../../../../../auth', which is a very long process,
// We can simply set an alias: "auth": ["./auth.js"] in our jsconfig.json file under the "paths" object.

// export { GET, POST } from 'auth';
// export const runtime = 'edge'; // optional
