"use client";

import {
  Image,
  Eraser,
  FileVideo,
  Film,
  Type,
  Bold,
  Captions,
  BrainCircuit,
  Languages,
  UserX,
  BadgeCheck,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const iconMap: Record<string, React.FC<LucideProps>> = {
  Image,
  Eraser,
  FileVideo,
  Film,
  Type,
  Bold,
  Captions,
  BrainCircuit,
  Languages,
  UserX,
  BadgeCheck,
  Trash2,
  ArrowRight,
};

interface LucideIconProps extends LucideProps {
  name: string;
}

export default function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
