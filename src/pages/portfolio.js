import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import * as R from 'ramda';

import Layout from '../components/layout';
import './portfolio.css';

const ProjectInfoLink = ({ text, url }) => {
  if (!url) {
    return null;
  }

  return (
    <i className="portfolio-project-info-link">
      <a href={url}>{text}</a>
    </i>
  );
};

const ProjectOverview = ({
  name,
  description,
  projectUrl,
  srcUrl,
  technologies,
  pageUrl,
  startDate,
  endDate,
  fluidImage,
  even,
}) => (
  <div
    className={`portfolio-root ${
      even ? 'portfolio-root-even' : 'portfolio-root-odd'
    }`}
  >
    <div className="portfolio-project-overview-content">
      <div className="portfolio-project-header">
        <h2 className="portfolio-project-title">
          <Link to={`/projects/${pageUrl}`}>{name}</Link>
        </h2>
        <i className="portfolio-project-info-link">{`${startDate} - ${endDate}`}</i>
        <div className="portfolio-project-info">
          <ProjectInfoLink text="Website" url={projectUrl} />
          <ProjectInfoLink text="Source Code" url={srcUrl} />
        </div>
      </div>
      <p className="portfolio-project-description">{description}</p>
    </div>
    {fluidImage ? (
      <Link
        to={`/projects/${pageUrl}`}
        style={{
          minWidth: 320,
          display: 'flex',
          flex: 1,
          paddingLeft: even ? 0 : 15,
          paddingRight: even ? 15 : 0,
        }}
      >
        <Img fluid={fluidImage} imgStyle={{ objectPosition: 'top center' }} />
      </Link>
    ) : null}
  </div>
);

const getProjectFilesQuery = graphql`
  {
    allProjectManifestJson {
      edges {
        node {
          name
          description
          projectUrl
          srcUrl
          technologies
          pageUrl
          image
          startDate
          endDate
        }
      }
    }
    allImageSharp {
      edges {
        node {
          fluid(maxWidth: 1200, quality: 85) {
            originalName
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  }
`;

const IndexInner = data => {
  const projects = data.allProjectManifestJson.edges.map(R.prop('node'));
  const imageList = data.allImageSharp.edges.map(R.path(['node', 'fluid']));
  const imageMap = imageList.reduce(
    (acc, fluid) => ({ ...acc, [fluid.originalName]: fluid }),
    {}
  );

  return (
    <Layout>
      <center>
        <h1>Software Project Portfolio</h1>
      </center>
      {projects.map((props, i) => (
        <ProjectOverview
          key={i}
          even={i % 2 == 0}
          {...props}
          fluidImage={imageMap[props.image]}
        />
      ))}
    </Layout>
  );
};

const PortfolioIndex = () => (
  <StaticQuery query={getProjectFilesQuery} render={IndexInner} />
);

export default PortfolioIndex;
