import Image from 'next/image';
// components
import { SelectArrowIcon } from 'client/components/icons';
import { Button, Tabs } from 'client/components/ui';
import Layout from 'client/components/Layout';
import AllInformation from 'client/components/app/AllInformation';
// helpers
import { shimmer, toBase64 } from 'client/helpers';
// styles
import { breakPoints, colors } from 'client/styles/variables';

export default function Home() {
  return (
    <Layout>
      <section className="banner">
        <Image
          src="/assets/home-banner.jpg"
          alt="banner"
          width={1200}
          height={700}
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '200px',
            objectFit: 'cover',
          }}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer('100%', '100%')
          )}`}
        />
        <div className="body-banner">
          <div className="letters-banner">
            <Image
              src="/assets/letters.svg"
              alt="letters"
              width={700}
              height={700}
              style={{ width: '100%', height: 'auto' }}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer('100%', '100%')
              )}`}
            />
          </div>
          <div className="button">
            <Button type="primary" block>
              Find yout next event
            </Button>
          </div>
        </div>
      </section>

      <section className="select container">
        <div className="row hg-8">
          <div className="title col-12 col-sm-3 col-lg-2">Popular in</div>
          <div className="col-12 col-sm-9 col-lg-10 row">
            <div className="icon col-2 col-sm-1">
              <SelectArrowIcon fill={colors.color2} />
            </div>
            <div className="col-6 col-md-4">
              <input type="text" />
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <Tabs
          items={[
            {
              key: '1',
              label: `All`,
              children: <AllInformation />,
            },
            {
              key: '2',
              label: `Online`,
              children: `Online`,
            },
            {
              key: '3',
              label: `Today`,
              children: `Today`,
            },
            {
              key: '4',
              label: `This weekend`,
              children: `This weekend`,
            },
            {
              key: '5',
              label: `Free`,
              children: `Free`,
            },
            {
              key: '6',
              label: `Music`,
              children: `Music`,
            },
            {
              key: '7',
              label: `Food & Drink`,
              children: `Food & Drink`,
            },
          ]}
        />
      </section>

      <style jsx>{`
        section:not(:first-of-type) {
          margin-top: 3rem;
        }

        .banner {
          position: relative;
        }

        .body-banner {
          left: 10%;
          position: absolute;
          top: 10%;
          width: 90%;
        }

        .letters-banner {
          width: 40%;
        }

        .body-banner .button {
          width: 70%;
        }

        .select .title {
          color: ${colors.lightBlack};
          font-size: clamp(1.38rem, calc(1.03rem + 1.96vw), 1.88rem);
          font-weight: bold;
          white-space: nowrap;
        }

        .select .icon {
          height: 30px;
        }

        .select input {
          border: none;
          border-bottom: 2px solid ${colors.gray};
          color: ${colors.color2};
          font-size: clamp(1.38rem, calc(1.03rem + 1.96vw), 1.88rem);
          font-weight: bold;
          outline: none;
          width: 100%;
        }

        @media (min-width: ${breakPoints.sm}) {
          .body-banner .button {
            width: 50%;
          }
        }

        @media (min-width: ${breakPoints.md}) {
          .select .title {
            text-align: right;
          }

          .select .icon {
            height: 40px;
          }

          .body-banner .button {
            width: 30%;
          }
        }
      `}</style>
    </Layout>
  );
}
