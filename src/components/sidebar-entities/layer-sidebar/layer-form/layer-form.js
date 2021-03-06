import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';

import FlexContainer from 'primitives/container/flex-container';
import Button from 'primitives/other/button';
import Checkbox from 'primitives/form/checkbox';
import Label from 'primitives/form/label';
import Input from 'primitives/form/input';

import { LAYER_NAME_LENGTH } from 'constants/defaults';
import './style.css';

export default function LayerForm({
  intl,
  sector,
  layerForm,
  updateLayer,
  submitForm,
  cancelForm,
  route,
  isValid,
  isEditing,
}) {
  return (
    <FlexContainer className="LayerForm" direction="column">
      <Label noPadding>
        <FormattedMessage id="misc.layerName" /> *
      </Label>
      <Input
        error={layerForm.name.length > LAYER_NAME_LENGTH}
        placeholder={intl.formatMessage(
          { id: 'misc.nameLimit' },
          { num: LAYER_NAME_LENGTH },
        )}
        value={layerForm.name}
        onChange={({ target }) => updateLayer('name', target.value)}
      />
      <Label>
        <FormattedMessage id="misc.layerDescription" />
      </Label>
      <Input
        type="textarea"
        rows="7"
        placeholder={intl.formatMessage({ id: 'misc.description' })}
        value={layerForm.description}
        onChange={({ target }) => updateLayer('description', target.value)}
      />
      <Checkbox
        label={intl.formatMessage({ id: 'misc.isHidden' })}
        value={layerForm.isHidden}
        onChange={({ target }) => updateLayer('isHidden', target.checked)}
      />
      <FlexContainer>
        <Button
          primary
          disabled={!isValid}
          className="LayerForm-Button"
          onClick={() => submitForm()}
        >
          <FormattedMessage
            id={isEditing ? 'misc.editLayer' : 'misc.createLayer'}
          />
        </Button>
        <Button
          className="LayerForm-Button"
          onClick={() =>
            isEditing ? cancelForm() : route(`/sector/${sector}`)
          }
        >
          <FormattedMessage id="misc.cancel" />
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
}

LayerForm.propTypes = {
  intl: intlShape.isRequired,
  sector: PropTypes.string.isRequired,
  layerForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isHidden: PropTypes.bool.isRequired,
  }).isRequired,
  updateLayer: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  route: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
};
