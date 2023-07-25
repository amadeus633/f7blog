import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export const ProtectedPostLayout = (props) => {
  const { children, meta } = props;
  const { title, date, image, passwordRequired } = meta;
  const router = useRouter();
  const contentEl = useRef(null);
  const [titles, setTitles] = useState([]);
  const [isVerified, setIsVerified] = useState(!passwordRequired);

  const promptedForPassword = useRef(false);

  useEffect(() => {
    if (passwordRequired && !promptedForPassword.current) {
      promptedForPassword.current = true;
      const enteredPassword = window.prompt(
        'Please enter your password to view this page!',
        ''
      );

      fetch('https://hashnode-passchecks.smacode.repl.co/auth', {
        // Make sure your server URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: passwordRequired, // This should match the page identifier on the server
          password: enteredPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            setIsVerified(true);
          } else {
            alert('Incorrect password!');
            router.push('/');
          }
        });
    }
  }, []);

  useEffect(() => {
    if (contentEl.current && isVerified) {
      const titleEls = [...contentEl.current.querySelectorAll('h2')].map(
        (el) => {
          return {
            text: el.textContent,
            el: el,
          };
        }
      );
      setTitles([...titleEls]);
    }
  }, [isVerified]);

  const onTitleClick = (e, title) => {
    e.preventDefault();
    title.el.scrollIntoView();
  };

  const formatDate = (d) => {
    return Intl.DateTimeFormat('en-us', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(d));
  };
  const onClick = (e) => {
    if (
      e.target.closest('a') &&
      e.target
        .closest('a')
        .getAttribute('href')
        .startsWith('https://blog.framework7.io')
    ) {
      e.preventDefault();
      router.push(
        e.target
          .closest('a')
          .getAttribute('href')
          .split('https://blog.framework7.io')[1]
      );
    }
  };

  if (!isVerified) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${title} | Framework7 Blog`}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        {image && (
          <>
            <meta
              property="og:image"
              content={`https://blog.framework7.io/${image}`}
            />
            <meta
              name="twitter:image"
              content={`https://blog.framework7.io/${image}`}
            />
          </>
        )}
      </Head>

      {titles.length > 0 && (
        <div className="post-index fixed right-0 top-16 hidden h-[calc(100vh-64px)] w-[calc((100vw-1024px)/2)] max-w-[256px] overflow-auto pb-16 pr-4 pt-16 xl:block">
          <div className="mb-3 text-sm font-bold text-on-surface">
            On this page
          </div>
          <ul className="text-sm">
            {titles.map((title) => (
              <li className="my-2" key={title.text}>
                <a
                  className="cursor-pointer text-secondary hover:text-primary"
                  onClick={(e) => onTitleClick(e, title)}
                >
                  {title.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="prose w-full max-w-none" onClick={onClick}>
        {image && (
          <div className="relative -mx-4 -mt-16 mb-8 sm:mx-0 sm:mt-0">
            <div className="relative overflow-hidden border-b border-border pb-[50%]  sm:rounded-2xl sm:border">
              <img
                className="absolute left-0 top-0 !m-0 !h-full !w-full object-cover object-center"
                src={`${image}`}
              />
            </div>
          </div>
        )}
        {date && (
          <div className="mb-2 text-sm text-on-surface-variant text-opacity-75">
            {formatDate(date)}
          </div>
        )}
        <div className="post-content" ref={contentEl}>
          {children}
        </div>
      </div>
    </>
  );
};

export default ProtectedPostLayout;
