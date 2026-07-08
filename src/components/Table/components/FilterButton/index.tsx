import type { JSXElementConstructor } from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';

export type FiltersButtonPropsDef = {
  FiltersContent: JSXElementConstructor<{}>;
  onSave: (props: { onClose: () => void }) => Promise<void>;
};

export const FilterButton = (props: FiltersButtonPropsDef) => {
  const { FiltersContent, onSave } = props;

  const [showFilters, hideFilters] = useDialog(() => {
    return (
      <Dialog
        Footer={() => {
          return (
            <>
              <Button onClick={hideFilters} text="Cancel" variant="mono" />
              <Button
                Icon={SearchIcon}
                onClick={() => {
                  onSave({ onClose: hideFilters });
                }}
                text="View Results"
              />
            </>
          );
        }}
        Header="Filters"
        onClose={hideFilters}
      >
        <FiltersContent />
      </Dialog>
    );
  }, []);

  return (
    <Button
      Icon={FilterAltIcon}
      onClick={showFilters}
      size="sm"
      text="Filter"
      variant="mono"
    />
  );
};
