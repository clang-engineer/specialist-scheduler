import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './point.reducer';
import { IPoint } from 'app/shared/model/point.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPointUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PointUpdate = (props: IPointUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { pointEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/point' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...pointEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="specialistSchedulerApp.point.home.createOrEditLabel" data-cy="PointCreateUpdateHeading">
            <Translate contentKey="specialistSchedulerApp.point.home.createOrEditLabel">Create or edit a Point</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : pointEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="point-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="point-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="point-title">
                  <Translate contentKey="specialistSchedulerApp.point.title">Title</Translate>
                </Label>
                <AvField
                  id="point-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                    minLength: { value: 5, errorMessage: translate('entity.validation.minlength', { min: 5 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="point-description">
                  <Translate contentKey="specialistSchedulerApp.point.description">Description</Translate>
                </Label>
                <AvField id="point-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/point" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  pointEntity: storeState.point.entity,
  loading: storeState.point.loading,
  updating: storeState.point.updating,
  updateSuccess: storeState.point.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PointUpdate);
