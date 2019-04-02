import React from 'react';
import { Button, Container } from 'pyrene/dist/pyrene.dev';
import Paragraph from '../../common/PageElements/Paragraph/Paragraph';
import DisplayBox from '../../common/PageElements/HowToElements/DisplayBox/DisplayBox';
import DescriptionBox from '../../common/PageElements/DescriptionBox/DescriptionBox';
import { ContentFiller } from '../../data/propsData';


const ButtonHTU = () => (
  <React.Fragment>
    <Paragraph title="Icon Usage">
      <DescriptionBox>
        Buttons can use icon to emphasise the functionality or convey more meaning to it.
      </DescriptionBox>
      <DisplayBox>
        <Button icon="share" label="Share" type="primary" />
        <Button icon="errorOutline" label="Delete" type="danger" />
        <Button icon="filter" label="Filter" type="secondary" />
        <Button icon="search" label="Search" type="ghost" />
        <Button icon="warning" label="Admin" type="admin" />
      </DisplayBox>
    </Paragraph>

    <Paragraph title="Admin Button">
      <DescriptionBox>
        Admin buttons have a different visual style and are used, when a certain action or view is accessible for MC Engineers only.
      </DescriptionBox>
      <DisplayBox width={286}>
        <Container
          title="network interfaces"
          adminAction={{ label: 'Admin', action: () => {} }}
          renderCallback={() => (
            <ContentFiller
              height={250}
            />
          )}
        />
      </DisplayBox>
    </Paragraph>
  </React.Fragment>
);


ButtonHTU.displayName = 'ButtonHT';

ButtonHTU.defaultProps = {};

ButtonHTU.propTypes = {};

export default ButtonHTU;
