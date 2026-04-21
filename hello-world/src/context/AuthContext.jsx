import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

