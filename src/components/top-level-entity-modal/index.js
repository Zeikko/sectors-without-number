import { connect } from 'react-redux';

import { cancelTopLevelEntityCreate } from 'store/actions/sector.actions';
import { getCurrentTopLevelEntities } from 'store/selectors/entity.selectors';
import { topLevelKeySelector } from 'store/selectors/base.selectors';
import { getTopLevelEntity } from 'utils/entity';

import TopLevelEntityModal from './top-level-entity-modal';

const mapStateToProps = state => {
  const topLevelKey = topLevelKeySelector(state);
  return {
    isOpen:
      !!topLevelKey &&
      !!getTopLevelEntity(getCurrentTopLevelEntities(state), topLevelKey),
  };
};

export default connect(mapStateToProps, { cancelTopLevelEntityCreate })(
  TopLevelEntityModal,
);
