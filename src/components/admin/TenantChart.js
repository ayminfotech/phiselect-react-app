// src/components/admin/charts/TenantChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const TenantChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="tenantName" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="userCount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

TenantChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TenantChart;