'use strict';
import './styles/base.scss';
import 'babel-polyfill';
import initPage from './init';
$(() => {
    new initPage();
});