import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import ReactHintFactory from 'react-hint';
import CompactPicker from 'react-color/lib/Compact';
import classNames from 'classnames';

import ConfirmModal from 'primitives/modal/confirm-modal';
import FlexContainer from 'primitives/container/flex-container';
import SectionHeader from 'primitives/text/section-header';
import LinkIcon from 'primitives/other/link-icon';
import Button from 'primitives/other/button';
import { EyeOff, Plus } from 'constants/icons';
import { map, sortBy } from 'constants/lodash';

import RegionRow from './region-row';
import LayerForm from './layer-form';
import './style.css';

const ReactHint = ReactHintFactory(React);

export default class LayerSidebar extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    layer: PropTypes.shape({
      description: PropTypes.string,
      isHidden: PropTypes.bool.isRequired,
      regions: PropTypes.shape(),
      name: PropTypes.string.isRequired,
    }),
    layerId: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    isShared: PropTypes.bool.isRequired,
    regionForm: PropTypes.shape({
      name: PropTypes.string,
      regionId: PropTypes.string,
      isHidden: PropTypes.bool,
    }),
    colorPicker: PropTypes.string,
    initializeRegionForm: PropTypes.func.isRequired,
    updateRegion: PropTypes.func.isRequired,
    removeRegion: PropTypes.func.isRequired,
  };

  static defaultProps = {
    layer: null,
    layerId: null,
    regionForm: null,
    colorPicker: null,
  };

  state = {
    regionDeletion: null,
  };

  onRenderContent = () => {
    if (!this.props.colorPicker) {
      return null;
    }
    return (
      <div className="LayerSidebar-ColorHint--content">
        <CompactPicker
          className="LayerSidebar-ColorHint--picker"
          onChangeComplete={({ hex }) =>
            this.props.updateRegion(this.props.colorPicker, { color: hex })
          }
          color={this.props.layer.regions[this.props.colorPicker].color}
        />
      </div>
    );
  };

  confirmDeletion = regionId => {
    this.setState({ regionDeletion: regionId });
  };

  renderHidden() {
    if (!this.props.layer.isHidden) {
      return null;
    }
    return (
      <FlexContainer className="LayerSidebar-Hidden">
        <EyeOff size={18} />
        <FormattedMessage
          id="misc.layerHidden"
          values={{ entity: this.props.layer.name }}
        />
      </FlexContainer>
    );
  }

  renderDescription() {
    if (!this.props.layer.description) {
      return null;
    }
    return (
      <FlexContainer
        direction="column"
        className="LayerSidebar-DescriptionContainer"
      >
        <span className="LayerSidebar-Label">
          <FormattedMessage id="misc.description" />
        </span>
        <p className="LayerSidebar-Description">
          {this.props.layer.description}
        </p>
      </FlexContainer>
    );
  }

  renderAddButton() {
    if (this.props.isShared) {
      return null;
    }
    return (
      <Button
        minimal
        className="LayerSidebar-AddButton"
        onClick={() => this.props.initializeRegionForm()}
      >
        <LinkIcon size={15} icon={Plus} />
        <FormattedMessage
          id="misc.addEntity"
          values={{
            entity: this.props.intl.formatMessage({
              id: 'misc.region',
            }),
          }}
        />
      </Button>
    );
  }

  render() {
    if (!this.props.layerId || this.props.isEditing) {
      return <LayerForm />;
    }

    let newRegion = null;
    if (this.props.regionForm && !this.props.regionForm.regionId) {
      newRegion = <RegionRow />;
    }

    return (
      <div>
        <FlexContainer className="LayerSidebar" direction="column" flex="1">
          {this.renderHidden()}
          {this.renderDescription()}
          <SectionHeader>
            <FlexContainer justify="spaceBetween" align="flexEnd">
              <FormattedMessage id="misc.regions" />
              {this.renderAddButton()}
            </FlexContainer>
          </SectionHeader>
          {newRegion}
          {sortBy(
            map(this.props.layer.regions || {}, (region, regionId) => ({
              ...region,
              sort: region.name.toLowerCase(),
              regionId,
            })),
            'sort',
          ).map(({ regionId, sort, ...region }) => (
            <RegionRow
              key={regionId}
              region={region}
              regionId={regionId}
              onDelete={this.confirmDeletion}
            />
          ))}
        </FlexContainer>
        <ReactHint
          persist
          attribute="data-color"
          className={classNames({
            'LayerSidebar-ColorHint': this.props.colorPicker,
          })}
          events={{ click: true }}
          position="right"
          onRenderContent={this.onRenderContent}
        />
        <ReactHint events attribute="data-paint" position="right" />
        <ConfirmModal
          intl={this.props.intl}
          isOpen={!!this.state.regionDeletion}
          onCancel={() => this.setState({ regionDeletion: null })}
          onConfirm={() => {
            this.props.removeRegion(this.state.regionDeletion);
            this.setState({ regionDeletion: null });
          }}
        />
      </div>
    );
  }
}
