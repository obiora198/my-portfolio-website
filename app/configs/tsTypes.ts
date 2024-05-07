
export interface ProjectType {
    images: string[];
    title: string;
    link: string;
    description: string;
    _id: string;
  }

export interface DialogPropsType {
    anchorEl: HTMLElement | null;
    id: string
    setAnchor: (anchor: HTMLElement | null) => void;
  }

export type ImagePropsType = {
    public_id: string | null;
    original_filename: string | null;
    [propName: string]: any | null;
  };