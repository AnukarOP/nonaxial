"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  showValues?: boolean;
  horizontal?: boolean;
  className?: string;
  animated?: boolean;
}

export function BarChart({
  data,
  maxValue,
  showValues = true,
  horizontal = false,
  className,
  animated = true,
}: BarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const max = maxValue || Math.max(...data.map((d) => d.value));

  if (horizontal) {
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-zinc-400">{item.label}</span>
              {showValues && <span className="text-sm font-medium text-white">{item.value}</span>}
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: item.color || "#8b5cf6",
                }}
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${(item.value / max) * 100}%` : 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("flex items-end gap-4 h-48", className)}>
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            className="w-full rounded-t-lg"
            style={{
              backgroundColor: item.color || "#8b5cf6",
            }}
            initial={{ height: 0 }}
            animate={{ height: isInView ? `${(item.value / max) * 100}%` : 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
          {showValues && (
            <span className="text-xs font-medium text-white">{item.value}</span>
          )}
          <span className="text-xs text-zinc-500 truncate max-w-full">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = "#8b5cf6",
  fillColor,
  className,
}: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {fillColor && (
        <polygon points={areaPoints} fill={fillColor} opacity={0.2} />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  size = 150,
  strokeWidth = 20,
  showLegend = true,
  className,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {data.map((item, index) => {
          const strokeDasharray = (item.value / total) * circumference;
          const strokeDashoffset = -offset;
          offset += strokeDasharray;

          return (
            <motion.circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          );
        })}
      </svg>
      {showLegend && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-zinc-300">{item.label}</span>
              <span className="text-sm font-medium text-white">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  sparklineData?: number[];
  icon?: React.ReactNode;
  className?: string;
}

export function MiniStat({
  label,
  value,
  trend,
  sparklineData,
  icon,
  className,
}: MiniStatProps) {
  return (
    <motion.div
      className={cn(
        "rounded-xl bg-zinc-900/50 border border-white/10 p-4",
        className
      )}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-zinc-400">{label}</span>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm flex items-center gap-1",
                trend.isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {sparklineData && (
          <Sparkline
            data={sparklineData}
            width={80}
            height={30}
            color={trend?.isPositive ? "#22c55e" : "#ef4444"}
            fillColor={trend?.isPositive ? "#22c55e" : "#ef4444"}
          />
        )}
      </div>
    </motion.div>
  );
}

interface HeatmapProps {
  data: number[][];
  xLabels?: string[];
  yLabels?: string[];
  colorScale?: string[];
  className?: string;
}

export function Heatmap({
  data,
  xLabels,
  yLabels,
  colorScale = ["#1e1b4b", "#3730a3", "#6366f1", "#a5b4fc"],
  className,
}: HeatmapProps) {
  const max = Math.max(...data.flat());
  const min = Math.min(...data.flat());
  const range = max - min || 1;

  const getColor = (value: number) => {
    const normalizedValue = (value - min) / range;
    const index = Math.min(
      Math.floor(normalizedValue * colorScale.length),
      colorScale.length - 1
    );
    return colorScale[index];
  };

  return (
    <div className={cn("inline-block", className)}>
      {yLabels && (
        <div className="flex mb-1">
          <div className="w-12" />
          {xLabels?.map((label, i) => (
            <div key={i} className="w-8 text-center text-xs text-zinc-500">
              {label}
            </div>
          ))}
        </div>
      )}
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {yLabels && (
            <div className="w-12 text-xs text-zinc-500 flex items-center">
              {yLabels[rowIndex]}
            </div>
          )}
          {row.map((value, colIndex) => (
            <motion.div
              key={colIndex}
              className="w-8 h-8 rounded-sm m-0.5"
              style={{ backgroundColor: getColor(value) }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (rowIndex * row.length + colIndex) * 0.01 }}
              title={`${value}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
