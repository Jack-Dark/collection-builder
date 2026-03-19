# What is this project?

This is a personal project I spun up specifically to practice creating a backend and utilizing tools I haven't used before or have little experience with. ***This project is not intended to use the most efficient solutions*** but to serve an educational exercise for backend development and tools I don't have significant experience with.

I chose to build a collection management tool as I wanted to build something I would actually have a reason to use. As an avid collector of many things, I wanted a way to track my collections should I ever need the record for insurance purposes.

# What are you tools are you using?

### Libraries that are (relatively) new to me:
(Some may not yet be implemented, but I intend to use them all)

| Tool/Library                                                                           | Thoughts                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Neon](https://neon.com/) - Postgres Database                                          | *Coming soon*                                                                                                                                                                                                                                                      |
| [Drizzle](https://orm.drizzle.team/) - ORM for interfacing with DB                     | *Coming soon*                                                                                                                                                                                                                                                      |
| [Zod](https://zod.dev/) - Schema validation                                            | I personally feel like [Yup](https://github.com/jquense/yup) is a better option for form validation, but it validates asynchronously which was causing issues with Tanstack Form.                                                                                  |
| [Better-Auth](https://better-auth.com/) - User authentication                          | *Coming soon*                                                                                                                                                                                                                                                      |
| [Resend](https://resend.com/docs/introduction) - Authentication emails                 | *Coming soon*                                                                                                                                                                                                                                                      |
| [Material Base UI](https://base-ui.com/react/overview/about) - React Component Library | Overall a pretty solid UI component library. While it's certainly more work, I much prefer using the Base UI library with Tailwind over the full Material UI library which feels too restrictive.                                                                  |
| [Tailwind CSS](https://tailwindcss.com/) - Atomic CSS library                          | I have used (and even written) atomic CSS libraries before, so this isn't anything new in concept, but I haven't truly utilized Tailwind specifically before. I found it nice and simple.                                                                          |
| [Tanstack Start](https://tanstack.com/start/latest) - Fullstack framework              | *Coming soon*                                                                                                                                                                                                                                                      |
| [Tanstack Router](https://tanstack.com/router/latest) - Fullstack framework routing    | *Coming soon*                                                                                                                                                                                                                                                      |
| [Tanstack Form](https://tanstack.com/form/latest) - Headless Forms UI                  | I prefer [Formik](https://formik.org/docs/overview). Because Tanstack Form is built to be framework agnostic, it feels like you have to do a lot of extra work for the form to be reactive, and I find an un-reactive form isn't particularly helpful, personally. |
| [Tanstack DB](https://tanstack.com/db/latest) - Reactive client-first DB stores        | *Coming soon*                                                                                                                                                                                                                                                      |
| [Tanstack Hotkeys](https://tanstack.com/hotkeys/latest) - Keyboard shortcuts           | *Coming soon*                                                                                                                                                                                                                                                      |
| [Vite](https://vite.dev/) - Build tool                                                 | No issues here, but I don't often spin up brand new projects from scratch. Works well!                                                                                                                                                                             |
| [Vitest](https://vitest.dev/) - Testing framework                                      | *Coming soon*                                                                                                                                                                                                                                                      |

# Anything else?

### I've used these libraries before, but I feel like they're worth calling out since I'm using so much else by TanStack:

| Tool/Library                                                                                       | Thoughts      |
| -------------------------------------------------------------------------------------------------- | ------------- |
| [Tanstack Query](https://tanstack.com/query/latest) - Async state management                       | *Coming soon* |
| [Tanstack Table](https://tanstack.com/table/latest) - Headless UI for building tables              | *Coming soon* |
| [Tanstack Dev Tools](https://tanstack.com/devtools/latest) - Devtools panel for TanStack libraries | *Coming soon* |


# Is that all?

### I'm thinking about using some of these too, if I can find a use case for them:

| Tool/Library                                                                  | Thoughts                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tanstack Store](https://tanstack.com/store/latest) - Global state management | *Coming soon*                                                                                                                                                                                                             |
| [Redux](https://redux.js.org/) - Global state management                      | *Coming soon* - I've used redux before, and honestly have a pretty low opinion of it. I feel like it's very easy to implement poorly, and then everyone has to deal with that. I much prefer [Jotai](https://jotai.org/). |

