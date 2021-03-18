import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@splunk/react-ui/Message';
import Button from '@splunk/react-ui/Button';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import update from 'immutability-helper';
import ControlWrapper from './ControlWrapper';
import { getUnifiedConfigs } from '../util/util';
import { MODE_CLONE, MODE_CREATE, MODE_EDIT } from '../constants/modes';

class BaseFormView extends Component {
    constructor(props) {
        super(props);

        // flag for to render hook method for once
        this.flag = true;
        this.state = {};
        const globalConfig = getUnifiedConfigs();
        this.appName = globalConfig.meta.name;

        this.util = {
            SetState: (state) => {
                this.setState(state);
            },
            setErrorFieldMsg: this.setErrorFieldMsg,
            clearAllErrorMsg: this.clearAllErrorMsg,
        };

        this.utilControlWrapper = {
            handleChange: this.handleChange,
            addCustomValidator: this.addCustomValidator,
            utilCustomFunctions: this.util,
        };

        if (props.isInput) {
            globalConfig.pages.inputs.services.forEach((service) => {
                if (service.name === props.serviceName) {
                    this.entities = service.entity;
                    if (service.hook) {
                        this.hookDeferred = this.loadHook(service.hook.src, globalConfig);
                    }
                }
            });
        } else {
            globalConfig.pages.configuration.tabs.forEach((tab) => {
                if (tab.name === props.serviceName) {
                    this.entities = tab.entity;
                    if (tab.hook) {
                        this.hookDeferred = this.loadHook(tab.hook.src, globalConfig);
                    }
                }
            });
        }

        const tmpState = {};
        this.entities.forEach((e) => {
            const tmpEntity = {};
            e.defaultValue = e.defaultValue ? e.defaultValue : '';

            if (props.mode === MODE_CREATE) {
                tmpEntity.value = typeof e.defaultValue !== 'undefined' ? e.defaultValue : '';
                tmpEntity.display =
                    typeof e?.options?.display !== 'undefined' ? e.options.display : true;
                tmpEntity.error = false;
                tmpEntity.disabled = false;
                tmpState[e.field] = tmpEntity;
            } else if (props.mode === MODE_EDIT) {
                tmpEntity.value =
                    typeof props.currentInput[e.field] !== 'undefined'
                        ? props.currentInput[e.field]
                        : e.defaultValue;
                tmpEntity.display =
                    typeof e?.options?.display !== 'undefined' ? e.options.display : true;
                tmpEntity.error = false;
                tmpEntity.disabled =
                    typeof e?.options?.disableonEdit !== 'undefined'
                        ? e.options.disableonEdit
                        : false;
                tmpState[e.field] = tmpEntity;
            } else if (props.mode === MODE_CLONE) {
                tmpEntity.value = e.field === 'name' ? '' : props.currentInput[e.field];
                tmpEntity.display =
                    typeof e?.options?.display !== 'undefined' ? e.options.display : true;
                tmpEntity.error = false;
                tmpEntity.disabled = e.field === 'name';
                tmpState[e.field] = tmpEntity;
            } else {
                throw new Error('Invalid mode :', props.mode);
            }
        });

        this.state = {
            data: tmpState,
            ErrorMsg: '',
            WarningMsg: '',
        };

        // Hook on create method call
        if (this.hookDeferred) {
            this.hookDeferred.then(() => {
                if (typeof this.hook.onCreate === 'function') {
                    this.hook.onCreate();
                }
            });
        }
    }

    handleRemove = () => {
        // function to remove data from backend
    };

    handleSubmit = () => {
        if (this.hook && typeof this.hook.onSave === 'function') {
            const validationPass = this.hook.onSave();
            if (!validationPass) {
                return false;
            }
        }
        const datadict = {};
        Object.keys(this.state.data).forEach((field) => {
            datadict[field] = this.state.data[field].value;
        });

        const saveSuccess = true;

        const returnValue = {
            result: saveSuccess,
            data: datadict,
        };

        if (saveSuccess) {
            if (this.hook && typeof this.hook.onSaveSuccess === 'function') {
                this.hook.onSaveSuccess();
            }
            return returnValue;
        }

        if (this.hook && typeof this.hook.onSaveFail === 'function') {
            this.hook.onSaveFail();
        }
        return returnValue;
    };

    handleChange = (field, targetValue) => {
        const newFields = update(this.state, {
            data: { [field]: { value: { $set: targetValue } } },
        });
        const tempState = this.clearAllErrorMsg(newFields);
        this.setState(tempState);

        if (this.hookDeferred) {
            this.hookDeferred.then(() => {
                if (typeof this.hook.onChange === 'function') {
                    this.hook.onChange(newFields[field]);
                }
            });
        }
    };

    addCustomValidator = (field, validator) => {
        const index = this.entities.findIndex((x) => x.field === field);
        this.entities[index].CustomValidator = validator;
    };

    // Set error message to display and set error in perticular field
    setErrorFieldMsg = (field, msg) => {
        const newFields = update(this.state, { data: { [field]: { error: { $set: true } } } });
        newFields.ErrorMsg = msg;
        this.setState(newFields);
    };

    // Set error in perticular field
    setErrorField = (field) => {
        const newFields = update(this.state, { data: { [field]: { error: { $set: true } } } });
        this.setState(newFields);
    };

    // Clear error message
    clearErrorMsg = () => {
        if (this.state.ErrorMsg) {
            const newFields = { ...this.state };
            newFields.ErrorMsg = '';
            this.setState(newFields);
        }
    };

    // Set error message
    setErrorMsg = (msg) => {
        const newFields = { ...this.state };
        newFields.ErrorMsg = msg;
        this.setState(newFields);
    };

    // Clear error message and errors from fields
    clearAllErrorMsg = (State) => {
        const newFields = State ? { ...State } : { ...this.state };
        newFields.ErrorMsg = '';
        const newData = State ? { ...State.data } : { ...this.state.data };
        const temData = {};
        Object.keys(newData).forEach((key) => {
            if (newData[key].error) {
                temData[key] = { ...newData[key], error: false };
            } else {
                temData[key] = newData[key];
            }
        });
        newFields.data = temData;
        return State ? newFields : null;
    };

    // Display error message
    generateErrorMessage = () => {
        if (this.state.ErrorMsg) {
            return (
                <div>
                    <Message appearance="fill" type="error">
                        {this.state.ErrorMsg}
                    </Message>
                </div>
            );
        }
        return null;
    };

    loadHook = (module, globalConfig) => {
        const myPromise = new Promise((myResolve) => {
            __non_webpack_require__([`app/${this.appName}/js/build/custom/${module}`], (Hook) => {
                this.hook = new Hook(globalConfig, this.props.serviceName, this.state, this.util);
                myResolve(Hook);
            });
        });
        return myPromise;
    };

    render() {
        // onRender method of Hook
        if (this.flag) {
            if (this.hookDeferred) {
                this.hookDeferred.then(() => {
                    if (typeof this.hook.onRender === 'function') {
                        this.hook.onRender();
                    }
                });
            }

            if (this.props.mode === MODE_EDIT) {
                if (this.hookDeferred) {
                    this.hookDeferred.then(() => {
                        if (typeof this.hook.onCreate === 'function') {
                            this.hook.onEditLoad();
                        }
                    });
                }
            }
            this.flag = false;
        }

        return (
            <>
                {this.props.renderSave ? (
                    <Message appearance="banner" type="info" onRequestRemove={() => {}}>
                        <span>
                            Your trial <strong>will expire soon</strong>. This message should
                            include
                            <Message.Link to="http://duckduckgo.com">inline links</Message.Link>
                            for recovery.
                        </span>
                    </Message>
                ) : null}
                <div className="form-horizontal" style={{ marginTop: '10px' }}>
                    {this.generateErrorMessage()}
                    {this.entities.map((e) => {
                        const temState = this.state.data[e.field];

                        return (
                            <ControlWrapper
                                key={e.field}
                                utilityFuncts={this.utilControlWrapper}
                                value={temState.value}
                                display={temState.display}
                                error={temState.error}
                                entity={e}
                                serviceName={this.props.serviceName}
                                mode={this.props.mode}
                                disabled={temState.disbled}
                            />
                        );
                    })}
                    {this.props.renderSave ? (
                        <ControlGroup label="">
                            <div style={{ flexGrow: 0 }}>
                                <Button appearance="primary" label="Save" />
                            </div>
                        </ControlGroup>
                    ) : null}
                </div>
            </>
        );
    }
}

BaseFormView.propTypes = {
    isInput: PropTypes.bool,
    serviceName: PropTypes.string,
    mode: PropTypes.string,
    currentInput: PropTypes.object,
};

export default BaseFormView;
