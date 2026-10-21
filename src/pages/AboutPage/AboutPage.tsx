import { Button } from '#/components/Button';
import { PageWrapper } from '#/components/PageWrapper';
import { githubUrl } from '#/constants/githubUrl';

// TODO - REQUIRED FEATURE: FILL OUT ABOUT PAGE
export const AboutPage = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10 max-w-200">
        <div className="grid gap-2">
          <h2>About the Developer</h2>
          <p>
            Collection Tracker was created by a frontend web developer (me!)
            that was out of work in order to put into practice everything I
            learned about how to build a backend so I could start applying for
            fullstack developer roles. It was built primarily in order to learn
            and practice with tools and libraries that I haven't had much - if
            any - experience with. I won't go into technical detail here, but if
            you're a developer, or you'd just like to know more, you can read my
            thoughts on the project and all the libraries and tools that I used.
          </p>

          <a className="flex" href={githubUrl.readme} target="_blank">
            <Button size="sm" text="View the README" />
          </a>
        </div>
      </div>
    </PageWrapper>
  );
};
